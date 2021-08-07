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
    public class ProductController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("saveproduct")]
        [HttpPost]
        public HttpResponseMessage SaveProduct()
        {
            try
            {
                Product product = new Product();
                product = JsonConvert.DeserializeObject<Product>(HttpContext.Current.Request.Form["product"]);


                HttpFileCollection MyFileCollection = HttpContext.Current.Request.Files;
                if (MyFileCollection.Count > 0)
                {
                    try
                    {
                        var filename = MyFileCollection[0].FileName;
                        Random random = new Random();
                        var Id = random.Next(1000000, 9999999).ToString();
                        product.Image = System.Web.HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["imagesPath"]) + Id + filename;
                        MyFileCollection[0].SaveAs(product.Image);

                    }
                    catch (Exception ex)
                    {

                    }
                }

                Product productdata = db.SaveProduct(product);
                return Request.CreateResponse(HttpStatusCode.OK, productdata);
            }
            catch (Exception ex)
            {
                Product productdata = new Product();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, productdata);
            }
        }


        [ActionName("getproducts")]
        [HttpPost]
        public HttpResponseMessage GetProducts()
        {
            try
            {
                var productlist = new List<Product>();
                productlist = db.GetProducts();
                foreach (Product product in productlist)
                {
                    if (File.Exists(product.Image))
                    {
                        byte[] imgdata = System.IO.File.ReadAllBytes(product.Image);
                        product.ImageFile = imgdata;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, productlist);
            }
            catch (Exception ex)
            {
                var productlist = new List<Product>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, productlist);
            }
        }


        [ActionName("getproductdata")]
        [HttpPost]
        public HttpResponseMessage GetProductById(Product product)
        {
            try
            {
                Product productdata = db.GetProductById(product.Id);
                if (File.Exists(productdata.Image))
                {
                    byte[] imgdata = System.IO.File.ReadAllBytes(productdata.Image);
                    productdata.ImageFile = imgdata;
                }
                return Request.CreateResponse(HttpStatusCode.OK, productdata);
            }
            catch (Exception ex)
            {
                var productdata = new Product();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, productdata);
            }
        }


        [ActionName("deleteproduct")]
        [HttpPost]
        public HttpResponseMessage DeleteProduct(Product product)
        {
            try
            {
                if (File.Exists(product.Image))
                {
                    File.Delete(product.Image);
                }
                db.DeleteProduct(product.Id);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }
    }
}