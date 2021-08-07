using Microsoft.Owin;
using Newtonsoft.Json;
using Service.DAL;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Service.Controllers
{
    public class CategoryController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("savecategory")]
        [HttpPost]
        public HttpResponseMessage SaveCategory()
        {
            try
            {
                Category category = new Category();
                category = JsonConvert.DeserializeObject<Category>(HttpContext.Current.Request.Form["category"]);


                HttpFileCollection MyFileCollection = HttpContext.Current.Request.Files;
                if (MyFileCollection.Count > 0)
                {
                    try
                    {
                        var filename = MyFileCollection[0].FileName;
                        Random random = new Random();
                        var Id = random.Next(1000000, 9999999).ToString();
                        category.Image = System.Web.HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["imagesPath"]) + Id + filename;
                        MyFileCollection[0].SaveAs(category.Image);



                    }
                    catch (Exception ex)
                    {

                    }
                }

                Category categorydata = db.SaveCategory(category);
                return Request.CreateResponse(HttpStatusCode.OK, categorydata);
            }
            catch (Exception ex)
            {
                Category categorydata = new Category();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, categorydata);
            }
        }


        [ActionName("getcategories")]
        [HttpPost]
        public HttpResponseMessage GetCategories()
        {
            try
            {
                var categorylist = new List<Category>();
                categorylist = db.GetCategories();
                foreach (Category category in categorylist)
                {
                    if (File.Exists(category.Image))
                    {
                        byte[] imgdata = System.IO.File.ReadAllBytes(category.Image);
                        category.ImageFile = imgdata;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, categorylist);
            }
            catch (Exception ex)
            {
                var categorylist = new List<Category>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, categorylist);
            }
        }


        [ActionName("getcategorydata")]
        [HttpPost]
        public HttpResponseMessage GetCategoryById(Category category)
        {
            try
            {
                Category categorydata = db.GetCategoryById(category.Id);
                if (File.Exists(categorydata.Image))
                {
                    byte[] imgdata = System.IO.File.ReadAllBytes(categorydata.Image);
                    categorydata.ImageFile = imgdata;
                }
                return Request.CreateResponse(HttpStatusCode.OK, categorydata);
            }
            catch (Exception ex)
            {
                var categorydata = new Category();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, categorydata);
            }
        }


        [ActionName("deletecategory")]
        [HttpPost]
        public HttpResponseMessage DeleteCategory(Category category)
        {
            try
            {
                if (File.Exists(category.Image))
                {
                    File.Delete(category.Image);
                }
                db.DeleteCategory(category.Id);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }
    }
}