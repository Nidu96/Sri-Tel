using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Service.DAL;
using Service.Models;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using System.Net.Mail;

namespace Service.Controllers
{
    public class SystemUsersController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("saveuser")]
        [HttpPost]
        public HttpResponseMessage SaveUser(SystemUser user)
        {
            try
            {
                SystemUser userdata = db.SaveUser(user);

                if(userdata != null)
                {
                    System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                    mail.To.Add(userdata.Username);
                    mail.From = new MailAddress("YOUR EMAIL", "Password", System.Text.Encoding.UTF8);
                    mail.Subject = "Your password";
                    mail.SubjectEncoding = System.Text.Encoding.UTF8;
                    mail.Body = "Your password is " + userdata.Password;
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

                db.SavePermissions(user);

                return Request.CreateResponse(HttpStatusCode.OK, userdata);
            }
            catch (Exception ex)
            {
                SystemUser userdata = new SystemUser();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, userdata);
            }
        }


        [ActionName("getusers")]
        [HttpPost]
        public HttpResponseMessage GetUsers()
        {
            try
            {
                var userlist = new List<SystemUser>();
                userlist = db.GetUsers();
                return Request.CreateResponse(HttpStatusCode.OK, userlist);
            }
            catch (Exception ex)
            {
                var userlist = new List<SystemUser>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, userlist);
            }
        }


        [ActionName("getuserdata")]
        [HttpPost]
        public HttpResponseMessage GetUserById(SystemUser user)
        {
            try
            {
                SystemUser userdata = db.GetUserById(user.Id);
                return Request.CreateResponse(HttpStatusCode.OK, userdata);
            }
            catch (Exception ex)
            {
                var userdata = new SystemUser();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, userdata);
            }
        }


        [ActionName("deleteuser")]
        [HttpPost]
        public HttpResponseMessage DeleteUser(SystemUser user)
        {
            try
            {
                db.DeleteUser(user.Id);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                var userlist = new List<SystemUser>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }

        #region encrypting
        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "app0000";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
        #endregion
    }
}