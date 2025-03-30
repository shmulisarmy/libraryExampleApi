// // example version of youtube's api/db schema


//  var videos = from video in Video.Videos
//                     join user in User.Users on video.User equals user.Id
//                     where user.Role == "Admin"
//                     select new
//                     {
//                         video,
//                         comments = (from comment in VideoComment.VideoComments
//                                     where comment.Video == video.Id
//                                     join commentLike in CommentLike.CommentLikes on comment.Id equals commentLike.Comment into comment_likes
//                                     select new
//                                     {
//                                         comment,
//                                         // this could take a significant amount of time if the comment has many likes, therefore in order to scale it we can use a use postgres jsonb, and use key value look up on video likes O(1) or make liked_by_poster a property of the comment that gets set when the user likes it O(1) rather than doing it each time in a query in O(n)
//                                         liked_by_poster = comment_likes.Any(i => i.User == video.User),
//                                         likes = comment_likes.Count(i => true)
//                                     }).ToList()
//                     };





//     foreach (var video in videos)
//     {
//         Console.WriteLine($"{video.video.Id}: {video.video.Title}");
//         foreach (var comment in video.comments)
//         {
//             Console.WriteLine($"  {comment.comment.Id}: {comment.comment.Text} (Likes: {comment.likes}, Liked by poster: {comment.liked_by_poster})");
//         }
//     }



// async void videoUpload(string title, string description, int user, int videoUploadId){
//     //getting media
//     Thread.Sleep(1000);
//     int newVideoId = Video.Videos.Count + 1;
//     start_upload(videoUploadId);
//     Video.Videos.Add(new Video{Id = newVideoId, Title = title, Description = description, IsPublished = false, User = user});
//     await Thread.Sleep(400);
//     while (upload_not_complete(videoUploadId)){
//         await Thread.Sleep(100);
//     }
// }






// class Video
// {
//     public int Id { get; set; }
//     public string? Title { get; set; }
//     public string? Description { get; set; }
//     public bool IsPublished { get; set; }
//     public int User { get; set; }

//     public static List<Video> Videos = new List<Video>()
//     {
//         new Video{Id = 1, Title = "Learning C#", Description = "C# tutorial video", IsPublished = true, User = 1},
//         new Video{Id = 2, Title = "Understanding LINQ", Description = "LINQ tutorial video", IsPublished = false, User = 1},
//         new Video{Id = 3, Title = "C# Advanced Topics", Description = "Advanced C# video", IsPublished = true, User = 2},
//         new Video{Id = 4, Title = "Intro to ASP.NET", Description = "ASP.NET introduction video", IsPublished = true, User = 2},
//         new Video{Id = 5, Title = "Web Development Basics", Description = "Web dev video", IsPublished = true, User = 3},
//     };
// }

// class VideoComment
// {
//     public int Id { get; set; }
//     public string? Text { get; set; }
//     public int User { get; set; }
//     public int Video { get; set; }

//     public static List<VideoComment> VideoComments = new List<VideoComment>()
//     {
//         new VideoComment{Id = 1, Text = "Great video, very helpful!", User = 2, Video = 1},
//         new VideoComment{Id = 2, Text = "I learned so much from this tutorial!", User = 3, Video = 1},
//         new VideoComment{Id = 3, Text = "This was a bit too advanced for me.", User = 1, Video = 2},
//         new VideoComment{Id = 4, Text = "Amazing introduction to ASP.NET!", User = 1, Video = 4},
//         new VideoComment{Id = 5, Text = "I wish there was more on backend development.", User = 2, Video = 5},
//     };
// }

// class User
// {
//     public int Id { get; set; }
//     public string? Name { get; set; }
//     public string? Email { get; set; }
//     public string? Password { get; set; }
//     public string? Role { get; set; }

//     public static List<User> Users = new List<User>()
//     {
//         new User{Id = 1, Name = "John Doe", Email = "john@example.com", Password = "password123", Role = "Admin"},
//         new User{Id = 2, Name = "Jane Doe", Email = "jane@example.com", Password = "password123", Role = "User"},
//         new User{Id = 3, Name = "Bob Smith", Email = "bob@example.com", Password = "password123", Role = "User"},
//     };
// }

// class CommentLike
// {
//     public int Id { get; set; }
//     public int User { get; set; }
//     public int Comment { get; set; }

//     public static List<CommentLike> CommentLikes = new List<CommentLike>()
//     {
//         new CommentLike{Id = 1, User = 1, Comment = 1},
//         new CommentLike{Id = 2, User = 3, Comment = 2},
//         new CommentLike{Id = 3, User = 2, Comment = 3},
//         new CommentLike{Id = 4, User = 1, Comment = 4},
//         new CommentLike{Id = 5, User = 2, Comment = 5},
//     };
// }


   
// class Subscription
// {
//     //relational table
//     public int Id { get; set; }
//     public int Subscriber { get; set; }
//     public int Channel { get; set; }

//     public static List<Subscription> Subscriptions = new List<Subscription>()
//     {
//         new Subscription{Id = 1, Subscriber = 1, Channel = 1},
//         new Subscription{Id = 2, Subscriber = 2, Channel = 2},
//         new Subscription{Id = 3, Subscriber = 3, Channel = 3},  
//     };
// }



// class Alert
// {
//     public int Id { get; set; }
//     public int User { get; set; }
//     public bool Seen { get; set; }
//     public Message Message { get; set; }


//     public static List<Alert> Alerts = new List<Alert>()
//     {
//     };
// }