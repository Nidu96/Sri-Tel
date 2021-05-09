using Service.DAL;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Service.Controllers
{
    public class AccessControlsController : ApiController
    {
        private DBContext db = new DBContext();

        //// GET api/<controller>
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/<controller>/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/<controller>
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/<controller>/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/<controller>/5
        //public void Delete(int id)
        //{
        //}


        [ActionName("saveaccesscontrol")]
        [HttpPost]
        public HttpResponseMessage SaveAccessControl(AccessControl accesscontrol)
        {
            try
            {
                AccessControl accesscontroldata = db.SaveAccessControl(accesscontrol);
                return Request.CreateResponse(HttpStatusCode.OK, accesscontroldata);
            }
            catch (Exception ex)
            {
                AccessControl accesscontroldata = new AccessControl();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, accesscontroldata);
            }
        }


        [ActionName("getaccesscontrols")]
        [HttpPost]
        public HttpResponseMessage GetAccessControls()
        {
            try
            {
                var accesscontrollist = new List<AccessControl>();
                accesscontrollist = db.GetAccessControls();
                return Request.CreateResponse(HttpStatusCode.OK, accesscontrollist);
            }
            catch (Exception ex)
            {
                var accesscontrollist = new List<AccessControl>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, accesscontrollist);
            }
        }


        [ActionName("getaccesscontroldata")]
        [HttpPost]
        public HttpResponseMessage GetAccessControlById(AccessControl accesscontrol)
        {
            try
            {
                AccessControl accesscontroldata = db.GetAccessControlById(accesscontrol.Id);
                return Request.CreateResponse(HttpStatusCode.OK, accesscontroldata);
            }
            catch (Exception ex)
            {
                var userdata = new AccessControl();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, userdata);
            }
        }


        [ActionName("deleteaccesscontrol")]
        [HttpPost]
        public HttpResponseMessage DeleteAccessControl(AccessControl accesscontrol)
        {
            try
            {
                db.DeleteAccessControl(accesscontrol.Id);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }
    }
}