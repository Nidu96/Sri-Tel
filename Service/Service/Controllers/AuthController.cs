using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.Extensions.Logging;
using Service.DAL;
using Service.Models;

namespace Service.Controllers
{
    public class AuthController : ApiController
    {
        private DBContext db = new DBContext();


        [ActionName("authenticate")]
        [HttpPost]
        public HttpResponseMessage Login(Credentials credentials)
        {
            try
            {
                SystemUser user;
                user = db.Login(credentials);
                
                if (user.Username != "usernotexists" && user.Password != "invalid" && user.Active != "deactive")
                {
                    Random random = new Random();
                    user.OTP = random.Next(1000,9999).ToString();

                    System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                    mail.To.Add(user.Username);
                    mail.From = new MailAddress("YOUR EMAIL", "OTP", System.Text.Encoding.UTF8);
                    mail.Subject = "Your OTP";
                    mail.SubjectEncoding = System.Text.Encoding.UTF8;
                    mail.Body = "Your OTP is " + user.OTP;
                    mail.BodyEncoding = System.Text.Encoding.UTF8;
                    mail.IsBodyHtml = true;
                    mail.Priority = MailPriority.High;
                    SmtpClient client = new SmtpClient();
                    client.Credentials = new System.Net.NetworkCredential("YOUR EMAIL", "YOUR PASSWORD");
                    client.Port = 587;
                    client.Host = "smtp.gmail.com";
                    client.EnableSsl = true;
                    try
                    {
                        client.Send(mail);
                    }
                    catch (Exception ex)
                    {
                        Exception ex2 = ex;
                        string errorMessage = string.Empty;
                        while (ex2 != null)
                        {
                            errorMessage += ex2.ToString();
                            ex2 = ex2.InnerException;
                        }
                       
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
            catch (Exception ex)
            {
                SystemUser user = new SystemUser();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, user);
            }
        }
    }
}