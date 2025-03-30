using System;
using System.Net;
using System.Net.Mail;




class EmailSender{
    public static WebApplicationBuilder? builderInstance = null!;
    public static List<(bool sent, MailMessage)> emailQueue = new List<(bool sent, MailMessage)>();
    List<string> logsReference;

    public EmailSender(List<string> logs){
        logsReference = logs;
    }

    SmtpClient getSmtpClient(){
        WebApplicationBuilder config = builderInstance!;


        string? googleAppPassword = config.Configuration["AppSettings:googleAppPassword"];
        if (googleAppPassword == null){
            // to test out this api without a google app password, comment out 'sendEmails();' at the end of the addEmail method and check out the /unsentEmails endpoint
            throw new Exception("Google app password not found. I (shmuli) removed it before sharing the repo");
        }



    SmtpClient smtp = new SmtpClient("smtp.gmail.com");
    smtp.Port = 587; 
    smtp.Credentials = new NetworkCredential("shmulikeller@gmail.com", googleAppPassword);
    smtp.EnableSsl = true;
    return smtp;
}



public void addEmail(string To, string Subject, string Body){
    MailMessage mail = new MailMessage();
    mail.From = new MailAddress("shmulikeller@gmail.com");
    mail.To.Add(To);
    mail.Subject = Subject;
    mail.Body = Body;
    emailQueue.Add((sent: false, mail));
    // sendEmails();
}

public void sendEmails(){
    SmtpClient smtp = getSmtpClient();
    emailQueue.Where(e => !e.sent).ToList().ForEach(e => {
        try{
            smtp.Send(e.Item2); 
            e.sent = true;
        }
        catch (Exception ex){
            Console.WriteLine("Error: " + ex.Message);
            logsReference.Add("Error: " + ex.Message + " at " + DateTime.Now.ToString());
        }
    });
}

}
