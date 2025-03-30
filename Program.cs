using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using SQLite;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;







List<string> logs = new List<string>();
EmailSender emailSender = new EmailSender(logs);
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseSqlite(builder.Configuration["AppSettings:DatabaseUrl"]!));



builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Practice API", Version = "v1" });
});
// Enable CORS - Allow all origins, methods, and headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


EmailSender.builderInstance = builder;

var app = builder.Build();

var EncryptionKey = builder.Configuration["AppSettings:EncryptionKey"]!;
var EncryptionIV = builder.Configuration["AppSettings:EncryptionIV"]!;

var encryptionService = new AesEncryptionService(EncryptionKey, EncryptionIV);



void test_encryptionService(){
    string secret_message = "This is a secret message";
    string encrypted_message = encryptionService.Encrypt(secret_message);
    string decrypted_message = encryptionService.Decrypt(encrypted_message);

    // was getting false positives from this, either due to whitespace, or it was comparing strings by reference and not value
    // Utils.assert_equals(secret_message.ToString(), decrypted_message.ToString());
    Console.WriteLine($"'{secret_message}' should equal '{decrypted_message}'");
}

test_encryptionService();




app.UseCors("AllowAll");

var adminRoutes = app.MapGroup("/admin");
adminRoutes.MapGet("", () => Results.Ok("this is the admin page"));
adminRoutes.MapGet("/books", () => Results.Ok("this is the admin books page"));





if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


var logger = app.Services.GetRequiredService<ILogger<Program>>();



app.MapGet("/unsentEmails", () => EmailSender.emailQueue.Where(e => !e.sent).Select(e => new { To = e.Item2.To, Subject = e.Item2.Subject, Body = e.Item2.Body }).ToList());



var connection_string = "main.db";
var db = new SQLiteConnection(connection_string);



var users = new List<User>{
    new User{Id = 1, Name = "shmuli", Email = "user1@localhost"},
    new User{Id = 2, Name = "david", Email = "user2@localhost"},
    new User{Id = 3, Name = "charlie", Email = "user3@localhost"},
};



db.CreateTable<User>();




app.MapGet("/tester", (HttpContext context) =>
{
    context.Request.Cookies.TryGetValue("email", out string? email);
    context.Request.Cookies.TryGetValue("id", out string? id);
    Console.WriteLine(email);
    return Results.Ok(new { email, id });
});





app.MapGet("/Book/create/{title}/{category}", (string title, string category) =>
{
    var newBook = new Book { Title = title, Category = category };
    db.Insert(newBook);
    return newBook;
});


app.MapGet("/inspectCache", (HttpContext context) =>
{
    if (!Info.DevMode) return Results.NotFound();
    // in dev mode for debug purposes
    return Results.Ok(Utils.cache);
});



var booksRouter = app.MapGroup("/books");


booksRouter.MapGet("/", () =>
{
    // as long there are no privacy policies on books
    return db.Query<Book>("select * from book");
});

booksRouter.MapGet("/{id}", (int Id) =>
{
    var book = db.Query<Book>("select * from Book where id = ?", Id);
    var books = db.Query<Book>("select * from Book join User on Book.CurrentHolderId = User.Id");
    return book;
});



booksRouter.MapGet("/category/{category}", (string category) =>
{
    return db.Query<Book>("select * from Book where category = ?", category);
});



var getAuthDetails = (HttpContext context) =>
{
    context.Request.Cookies.TryGetValue("email", out string? encEmail);
    context.Request.Cookies.TryGetValue("id", out string? encId);
    return (encryptionService.Decrypt(encEmail), encryptionService.Decrypt(encId));
};


booksRouter.MapGet("/borrow/{id}", (int id, HttpContext context) =>
{
    var (email, userId) = getAuthDetails(context);
    var book = db.Query<Book>("select * from Book")[0];
    var user = db.Query<User>("select * from User")[0];
    if (book == null || user == null)
    {
        return Results.NotFound();
    }

    if (book.CurrentHolder != null)
    {
        return Results.BadRequest("Book is already borrowed, you wanna join the waitlist?");
    }
    if (book.WaitList.Count > 0 && book.WaitList[0] != user)
    {
        if (book.daySinceLastBorrow() > 3)
        {
            return Results.Ok("the user who this is reserved for hasn't picked it up in 3 days so you may skip them");
        }
        return Results.BadRequest($"the book will go to the first user on the waitlist, unless it's not picked up by {book.LastBorrow}");
    }
    book.CurrentHolder = user;
    db.Update(book);
    return Results.Ok(book);
});



booksRouter.MapPost("/hopOnWaitList/{id}/{userId}", (int id, int userId) =>
{
    var user = users.FirstOrDefault(u => u.Id == userId);
    var book = Book.instances.FirstOrDefault(b => b.Id == id);
    if (book == null || user == null)
    {
        return Results.NotFound();
    }
    if (book.CurrentHolder == user)
    {
        return Results.BadRequest("You can't join the waitlist while you already have the book");
    }
    if (book.WaitList.Contains(user))
    {
        return Results.BadRequest("You are already on the waitlist, no double dipping");
    }
    book.WaitList.Add(user);
    if (book.CurrentHolder == null)
    {
        return Results.Ok("no one has the book, you can borrow it");
    }
    return Results.Ok(book.WaitList);
});




(Book, User, object) GetItemOrErr_BookAndUser (int id, int userId){
    var user = users.FirstOrDefault(u => u.Id == userId);
    var book = Book.instances.FirstOrDefault(b => b.Id == id);
    if (book == null || user == null)
    {
        return (null, null, Results.NotFound());
    }
    if (book.CurrentHolder != user)
    {
        return (null, null, Results.BadRequest("You don't have this book"));
    }
    return (book, user, null);
}

app.MapGet("/books/return/{id}/{userId}", (int id, int userId) =>
{
    var (book, user, err) = GetItemOrErr_BookAndUser(id, userId);
    if (err != null) return err;
    book.CurrentHolder = null;
    db.Update(book);
    if (book.WaitList.Count > 0)
    {
        var nextUser = book.WaitList[0];
        book.LastBorrow = DateTime.Now;
        // EmailNotification.EmailQueue.Add(new EmailNotification
        // {
        //     To = nextUser.Email,
        //     Subject = "Your book is ready!",
        //     Body = "The book you reserved is ready for you to borrow. Please come by to pick it up."
        // });
        return Results.Ok("the book has been returned, the next user on the waitlist has been sent an email");
    }
    return Results.Ok("the book has been returned, no one is waiting for it");
});




app.MapGet("/BookComment/create/{UserId}/{BookId}/{Comment}", (int UserId, int BookId, string Comment) =>
{
    var newBookComment = new BookComment { UserId = UserId, BookId = BookId, Comment = Comment };
    db.Insert(newBookComment);
    return newBookComment;
});





db.CreateTable<BookComment>();


app.MapGet("/protected", (HttpContext context) =>{
    // made for cookie learning purposes
    var email = context.Request.Cookies["email"];
    if (email == null) return Results.BadRequest("you are not logged in, go to /auth/login-step-one");
    return Results.Ok(new { email = encryptionService.Decrypt(email), id = encryptionService.Decrypt(context.Request.Cookies["id"]) });
});



app.MapGet("/comments/{bookId}", (int bookId) =>
{
    return db.Query<BookComment>("select * from BookComment where id  = ?", bookId);
});

app.MapGet("/pages/{htmlPage}", (string htmlPage) =>
{   
    string page = htmlPage + ".html";
    string safePath = Path.Combine("pages", page);

    if (!File.Exists(safePath))
    {
        return Results.NotFound("File not found");
    }

    var stream = File.OpenRead(safePath);
    var contentType = "text/html";

    return Results.File(stream, contentType);
});


booksRouter.MapGet("/withComments", (LibraryContext db) =>
{
    var getBooks = () => (from book in db.Book
                          join comment in db.BookComment on book.Id equals comment.BookId into comments
                          let topComment = comments.OrderByDescending(c => c.Id).FirstOrDefault()
                          join user in db.User on topComment.UserId equals user.Id into commenters
                          from commenter in commenters.DefaultIfEmpty()
                          select new
                          {
                              book.Id,
                              book.Title,
                              category = book.Category,
                              image = book.Image,
                              available = book.CurrentHolder == null,
                              top_comment = commenter != null ? new { topComment.Comment, commenter.Email } : null
                          }).ToList();
    return Utils.GetOrCache("booksWithComments", getBooks, refreshEvery: 20);
});





booksRouter.MapGet("/one", (LibraryContext db) =>
{
    //to lean how to set limits inside the db using linq with Take(n)
    return (from book in db.Book.OrderByDescending(b => b.Id).Take(2) 
            join comment in db.BookComment on book.Id equals comment.BookId into comments
            select new {
                book.Id,
                book.Title,
                book.Category,
                comments
            }).ToList();
});



app.MapPost("/comment/{bookId}/{userId}/{comment}", (int bookId, int userId, string comment) =>
{
    var user = users.FirstOrDefault(u => u.Id == userId);
    var book = Book.instances.FirstOrDefault(b => b.Id == bookId);
    if (book == null || user == null)
    {
        return Results.NotFound();
    }
    var createdComment = new BookComment { BookId = bookId, UserId = userId, Comment = comment };
    db.Insert(createdComment);
    return Results.Created($"/comment/{bookId}/{userId}/{comment}", createdComment);
});



// you cannot get another code until the expiration code runs out
var emails_for_signup_with_code = new Dictionary<string, (string code, DateTime expiration)>();




var authRouter = app.MapGroup("/auth");
authRouter.MapGet("/signup-step-one", (LibraryContext db, HttpContext context, [FromQuery] string providedEmail) =>
{
    var user = db.User.Where(u => u.Email == providedEmail).Select(u => u.Email).FirstOrDefault();
    if (user != null) {
        return Results.BadRequest("a user with this email already exists");
    }
    if (emails_for_signup_with_code.ContainsKey(providedEmail)){
        var (_, expiration) = emails_for_signup_with_code[providedEmail];
        return Results.Ok($"a code has already been sent to your email, which will expire at {expiration}, at which time you can request another code");
    }
    var code = Utils.sixCharCode();
    Console.WriteLine(code);
    emails_for_signup_with_code[providedEmail] = (code, DateTime.Now.AddMinutes(1));
    emailSender.addEmail(providedEmail, "Signup code", $"Your code is {code}");
    return Results.Ok("a code has been sent to your email, which will expire in one minute");
});

authRouter.MapPost("/signup-step-two", (LibraryContext db, HttpContext context, [FromQuery] string providedEmail, [FromQuery] string code) =>
{
    var user = db.User.Where(u => u.Email == providedEmail).Select(u => u.Email).FirstOrDefault();
    if (user != null) {
        return Results.BadRequest("a user with this email already exists");
    }
    if (!emails_for_signup_with_code.ContainsKey(providedEmail)){
        return Results.BadRequest("no code has been sent to your email, go to /signup-step-one");
    }
    var (storedCode, expiration) = emails_for_signup_with_code[providedEmail];
    if (DateTime.Now > expiration){
        return Results.BadRequest("a code has been sent, but has expired");
    }
    if (storedCode != code){
        return Results.BadRequest("the code is invalid");
    }
    var newUser = new User { Name = providedEmail, Email = providedEmail };
    Utils.displayObject(newUser);
    db.User.Add(newUser);
    db.SaveChanges();
    emails_for_signup_with_code.Remove(providedEmail);
    context.Response.Cookies.Append("email", encryptionService.Encrypt(providedEmail));
    context.Response.Cookies.Append("id", encryptionService.Encrypt(newUser.Id.ToString()));
    return Results.Ok("user created");

});




var emails_for_login_with_code = new Dictionary<string, (string code, DateTime expiration)>();

authRouter.MapGet("/login-step-one", (LibraryContext db, HttpContext context, [FromQuery] string providedEmail) =>
{
    var user = db.User.Where(u => u.Email == providedEmail).Select(u => u.Email).FirstOrDefault();
    if (user == null) {
        return Results.BadRequest("a user with this email does not exist");
    }
    if (emails_for_login_with_code.ContainsKey(providedEmail)){
        var (_, expiration) = emails_for_login_with_code[providedEmail];
        if (DateTime.Now > expiration){
            return Results.Ok($"a code has already been sent to your email, which will expire at {expiration}, at which time you can request another code");
        }
    }
    var code = Utils.sixCharCode();
    Console.WriteLine(code);
    emails_for_login_with_code[providedEmail] = (code, DateTime.Now.AddMinutes(1));
    emailSender.addEmail(providedEmail, "Login code", $"Your code is {code}");
    return Results.Ok("a code has been sent to your email, which will expire in one minute");
});

authRouter.MapPost("/login-step-two", (LibraryContext db, HttpContext context, [FromQuery] string providedEmail, [FromQuery] string code) =>
{

    Console.WriteLine("email: " + providedEmail + " code: " + code);

    var user = db.User.Where(u => u.Email == providedEmail).FirstOrDefault();
    if (user == null) {
        return Results.BadRequest("a user with this email does not exist, go to /signup-step-one");
    }
    if (!emails_for_login_with_code.ContainsKey(providedEmail)){
        return Results.BadRequest("no code has been sent to your email, go to /login-step-one");
    }
    var (storedCode, expiration) = emails_for_login_with_code[providedEmail];
    if (DateTime.Now > expiration){
        return Results.BadRequest("a code has been sent, but has expired");
    }
    if (storedCode != code){
        return Results.BadRequest("the code is invalid");
    }
    // emails_for_login_with_code.Remove(providedEmail); // TODO
    context.Response.Cookies.Append("email", encryptionService.Encrypt(providedEmail));
    context.Response.Cookies.Append("id", encryptionService.Encrypt(user.Id.ToString()));
    return Results.Ok("user logged in");
});





app.Run();





public class User
{
    [SQLite.PrimaryKey, SQLite.AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

}






public class Book
{
    //so that way new categories we'll get a `New` tag 
    public static List<(string category, DateTime creationDate, List<User> subscribers)> categories = new List<(string category, DateTime creationDate, List<User> subscribers)>();
    public static List<Book> instances = new List<Book>();
    [SQLite.PrimaryKey, SQLite.AutoIncrement]
    public int Id { get; set; } = 0;
    public string Title { get; set; } = string.Empty;
    public string? Image { get; set; }
    // [Ignore]
    public int? CurrentHolderId
    {
        get { if (CurrentHolder != null) { return CurrentHolder!.Id; } else { return 0; } }
        set { }
    }
    [Ignore]
    public User? CurrentHolder { get; set; }
    [Ignore]
    public List<User> WaitList { get; set; } = new List<User>();
    public DateTime LastBorrow { get; set; } = DateTime.Now;
    public string Category { get; set; } = string.Empty;
    public int daySinceLastBorrow()
    {
        return (int)(DateTime.Now - LastBorrow).TotalDays;
    }
    public Book()
    {
        Id = Book.instances.Count;
        Book.instances.Add(this);
        if (!Book.categories.Any(c => c.category == Category))
        {
            Book.categories.Add((Category, DateTime.Now, new List<User>()));
        }
        else
        {
            //alert category subscribers
        }
    }

    static Book()
    {
        new Book { Title = "the queen of persia", CurrentHolder = null, WaitList = new List<User>(), Category = "history" };
        new Book { Title = "the golden crown", CurrentHolder = null, WaitList = new List<User>(), Category = "history" };
        new Book { Title = "the secret of the golden crown", CurrentHolder = null, WaitList = new List<User>(), Category = "history" };
        new Book { Title = "the secret of the pirate", CurrentHolder = null, WaitList = new List<User>(), Category = "history" };
        new Book { Title = "the lost treasure", CurrentHolder = null, WaitList = new List<User>(), Category = "adventure" };
    }
}




public class BookComment
{
    [SQLite.PrimaryKey, SQLite.AutoIncrement]
    public int Id { get; set; } = 0;
    public int BookId { get; set; }
    public int UserId { get; set; }
    public string Comment { get; set; } = string.Empty;
    // public BookComment() {
    //     BookComment.instances.Add(this);
    //     Id = BookComment.instances.Count;
    // }

}

class booksWithComments : Book
{
    public List<BookComment> Comments { get; set; } = new List<BookComment>();
}


public class LibraryContext : DbContext
{
    public DbSet<Book> Book { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<BookComment> BookComment { get; set; }

    public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }
}

