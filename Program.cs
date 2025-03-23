using System;
using System.Threading;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

















var users = new List<User>{
    new User{Id = 1, Name = "shmuli", Email = "user1@localhost"},
    new User{Id = 2, Name = "david", Email = "user2@localhost"},
    new User{Id = 3, Name = "charlie", Email = "user3@localhost"},
};




app.MapGet("/books", () => {
    Console.WriteLine("Get books");
    return Book.instances;
});

app.MapGet("/books/{id}", (int id) => {
    Console.WriteLine("Get book by id");
    return Book.instances.FirstOrDefault(b => b.Id == id);
});



app.MapGet("/books/category/{category}", (string category) => {
    return Book.instances.Where(b => b.Category == category);
});





app.MapGet("/books/borrow/{id}/{userId}", (int id, int userId) => {
    var user = users.FirstOrDefault(u => u.Id == userId);
    var book = Book.instances.FirstOrDefault(b => b.Id == id);
    if (book == null || user == null) {
        return Results.NotFound();
    }
    if (book.CurrentHolder != null) {
        return Results.BadRequest("Book is already borrowed, you wanna join the waitlist?");
    }
    if (book.WaitList.Count > 0 && book.WaitList[0] != user) {
        if (book.daySinceLastBorrow() > 3) {
            return Results.Ok("the user who this is reserved for hasn't picked it up in 3 days so you may skip them");
        }
        return Results.BadRequest($"the book will go to the first user on the waitlist, unless it's not picked up by {book.LastBorrow}");
    }
    book.CurrentHolder = user;
    return Results.Ok(book);
});



app.MapGet("/books/hopOnWaitList/{id}/{userId}", (int id, int userId) => {
    var user = users.FirstOrDefault(u => u.Id == userId);
    var book = Book.instances.FirstOrDefault(b => b.Id == id);
    if (book == null || user == null) {
        return Results.NotFound();
    }
    if (book.CurrentHolder == user) {
        return Results.BadRequest("You can't join the waitlist while you already have the book");
    }
    if (book.WaitList.Contains(user)) {
        return Results.BadRequest("You are already on the waitlist, no double dipping");
    }
    book.WaitList.Add(user);
    if (book.CurrentHolder == null) {
        return Results.Ok("no one has the book, you can borrow it");
    }
    return Results.Ok(book.WaitList);
});

app.MapGet("/books/return/{id}/{userId}", (int id, int userId) => {
    var user = users.FirstOrDefault(u => u.Id == userId);
    var book = Book.instances.FirstOrDefault(b => b.Id == id);
    if (book == null || user == null) {
        return Results.NotFound();
    }
    if (book.CurrentHolder != user) {
        return Results.BadRequest("You don't have this book");
    }
    book.CurrentHolder = null;
    if (book.WaitList.Count > 0) {
        var nextUser = book.WaitList[0];
        book.LastBorrow = DateTime.Now;
        EmailNotification.instances.Add(new EmailNotification{
            To = nextUser.Email,
            Subject = "Your book is ready!",
            Body = "The book you reserved is ready for you to borrow. Please come by to pick it up."
        });
        return Results.Ok("the book has been returned, the next user on the waitlist has been sent an email");
    }
    return Results.Ok("the book has been returned, no one is waiting for it");
});


app.MapGet("/books/category/{category}", (string category) => {
    return Book.instances.Where(b => b.Category == category);
});


app.MapGet("/emails", () => {
    return EmailNotification.instances;
});

app.MapGet("/emails/{userId}", (int userId) => {
    return EmailNotification.instances;
});





app.Urls.Add("http://localhost:3030/");

app.Run();




class EmailNotification{
    public static List<EmailNotification> instances = new List<EmailNotification>();
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool Sent { get; set; } = false;
}

class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

}






class Book
{
    //so that way new categories we'll get a `New` tag 
    public static List<(string category, DateTime creationDate, List<User> subscribers)> categories = new List<(string category, DateTime creationDate, List<User> subscribers)>();
    public static List<Book> instances = new List<Book>();  
    public int Id { get; set; } = 0;
    public string Title { get; set; } = string.Empty;
    public User? CurrentHolder { get; set; }
    public List<User> WaitList { get; set; } = new List<User>();
    public DateTime LastBorrow { get; set; } = DateTime.Now;
    public string Category { get; set; } = string.Empty;
    public int daySinceLastBorrow() {
        return (int)(DateTime.Now - LastBorrow).TotalDays;
    }
    public Book()
    {
        Id = Book.instances.Count;
        if (!Book.categories.Any(c => c.category == Category))
        {
            Book.categories.Add((Category, DateTime.Now));
        } else {
            Book.categories.FirstOrDefault(c => c.category == Category).subscribers.ForEach(subscriber => EmailNotification.instances.Add(new EmailNotification{
                To = subscriber.Email,
                Subject = "New Book Added",
                Body = $"'{Title}' in the {Category} category has been added to the library!!!"
            }));
        }
    }

    static Book() {
        Console.WriteLine("Initializing books class");
     Book.instances = new List<Book>{
        new Book{Title = "the queen of persia", CurrentHolder = null, WaitList = new List<User>(), Category = "history"},
        new Book{Title = "the golden crown", CurrentHolder = null, WaitList = new List<User>(), Category = "history"},
        new Book{Title = "the secret of the golden crown", CurrentHolder = null, WaitList = new List<User>(), Category = "history"},
        new Book{Title = "the secret of the pirate", CurrentHolder = null, WaitList = new List<User>(), Category = "history"},
        new Book{Title = "the lost treasure", CurrentHolder = null, WaitList = new List<User>(), Category = "adventure"},
    };
   
    }
}

