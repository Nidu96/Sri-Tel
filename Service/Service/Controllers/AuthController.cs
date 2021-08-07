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