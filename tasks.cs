// using System.ComponentModel.DataAnnotations.Schema;
// using System;
// using System.Threading;
// using SQLite;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using Microsoft.Extensions.Logging;
// using Microsoft.EntityFrameworkCore.Sqlite;
// using Microsoft.EntityFrameworkCore;


// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.
// // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
// builder.Services.AddDbContext<TasksContext>(options =>
//     options.UseSqlite("tasks.db"));



// // Enable CORS - Allow all origins, methods, and headers
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyMethod()
//               .AllowAnyHeader();
//     });
// });


// var app = builder.Build();


// using (var scope = app.Services.CreateScope())
// {
//     var dbContext = scope.ServiceProvider.GetRequiredService<TasksContext>();
//     dbContext.Database.Migrate(); // Ensures tables are created
// }





// app.UseCors("AllowAll");


// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();






























// app.MapGet("/seed", (TasksContext db) =>
// {
//     Other.AddSeedData(db);
//     return "Seed data added";
// });







// app.MapGet("/users", (TasksContext db) =>
// {
//     return db.Users.ToList();
// });



// app.MapGet("/tasks", (TasksContext db) =>
// {
//     return db.Tasks.ToList();
// });



// app.MapGet("/boards", (TasksContext db) =>
// {
//     return db.Boards.ToList();
// });



// app.MapGet("/lists", (TasksContext db) =>
// {
//     return db.Lists.ToList();
// });


// app.MapGet("/userRoles", (TasksContext db) =>
// {
//     return db.UserRoles.ToList();
// });

// app.MapGet("/board/{boardId}/{UserId}", (TasksContext db, int boardId, int userId) =>{
//     var selectedBoard = from board in db.Boards
//              join userRole in db.UserRoles on board.Id equals userRole.BoardId
//              where userRole.UserId == userId && board.Id == boardId
//             select new {board, 
//             lists = db.Lists.Where(l => l.BoardId == board.Id).ToList(), 
//             tasks = db.Tasks.Where(t => t.BoardId == board.Id).ToList()};
//      var resultBoard = selectedBoard.FirstOrDefault();
//      if (resultBoard == null) {
//         return Results.NotFound("You are not authorized to view this board");
//      };
//      return Results.Ok(resultBoard);
// });


// app.MapGet("/boards/{userId}", (TasksContext db, int userId) =>{
//     var boards = from board in db.Boards
//              join userRole in db.UserRoles on board.Id equals userRole.BoardId
//              where userRole.UserId == userId
//             select new {board, 
//             notifications = db.BoardRelatedNotifications.Where(n => n.BoardId == board.Id).ToList(),
//             taskAmounts = db.Tasks.Count(t => t.BoardId == board.Id)};
//     return boards;
// });


// app.MapPost("/createTask/{userId}", (TasksContext db, Task task, int userId) =>{
//     var selectedBoard = from board in db.Boards
//     join userRole in db.UserRoles on board.Id equals userRole.BoardId
//     where userRole.UserId == userId && board.Id == task.BoardId
//     select new {board, list = db.Lists.Where(l => l.BoardId == board.Id && l.Id == task.ListId).FirstOrDefault()};

//     Console.WriteLine(selectedBoard);

//     if (selectedBoard == null) {
//         return Results.NotFound("You are not authorized to view this board");
//     }

//     db.Tasks.Add(task);
//     db.SaveChanges();
//     return Results.Ok(task);
// });


// var exampleTask = new Task{
//     Name = "Example Task",
//     BoardId = 1,
//     ListId = 1
// };









// Utils.displayObject(exampleTask);








// app.Run();










// class User
// {
//     [SQLite.PrimaryKey, SQLite.AutoIncrement]
//     public int Id { get; set; } = 0;
//     public string FirstName { get; set; } = string.Empty;
//     public string LastName { get; set; } = string.Empty;
//     public string Email { get; set; } = string.Empty;
//     public string Password { get; set; } = string.Empty;
//     public string Role { get; set; } = "viewer";
//     public bool isAdminAccount { get; set; } = false;

// }




// class Board{
//     [SQLite.PrimaryKey, SQLite.AutoIncrement]
//     public int Id { get; set; } = 0;
//     public string Name { get; set; } = string.Empty;
//     public string Description { get; set; } = string.Empty;

// }

// class BoardRelatedNotifications{
//     [SQLite.PrimaryKey, SQLite.AutoIncrement]
//     public int Id { get; set; } = 0;
//     public int BoardId { get; set; } = 0;
//     public string Notification { get; set; } = string.Empty;
// }


// class userRoles{
//     [SQLite.PrimaryKey, SQLite.AutoIncrement]
//     public int Id { get; set; } = 0;
//     [ForeignKey("User")]
//     public int UserId { get; set; } = 0;
//     [ForeignKey("Board")]
//     public int BoardId { get; set; } = 0;
//     public string Role { get; set; } = "viewer";
// }


// class List{
//     [SQLite.PrimaryKey, SQLite.AutoIncrement]
//     public int Id { get; set; } = 0;
//     public int BoardId { get; set; }
//     public string Name { get; set; } = string.Empty;
//     public string Description { get; set; } = string.Empty;
// }



// class Task{
//     [SQLite.PrimaryKey, SQLite.AutoIncrement]
//     public int Id { get; set; } = 0;
//     public int ListId { get; set; }
//     public int BoardId { get; set; }
//     public string Name { get; set; } = string.Empty;
// }

// class TasksContext : DbContext
// {
//     public DbSet<User> Users { get; set; }
//     public DbSet<Board> Boards { get; set; }
//     public DbSet<List> Lists { get; set; }
//     public DbSet<Task> Tasks { get; set; }
//     public DbSet<userRoles> UserRoles { get; set; }
//     public DbSet<BoardRelatedNotifications> BoardRelatedNotifications { get; set; }

//     public TasksContext(DbContextOptions<TasksContext> options) : base(options) { }

//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//     {
//         optionsBuilder.UseSqlite("Data Source=tasks.db");
//     }
// }















