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
    public class BannerController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("savebanner")]
        [HttpPost]
        public HttpResponseMessage SaveBanner()
        {
            try
            {
                Banner banner = new Banner();
                banner = JsonConvert.DeserializeObject<Banner>(HttpContext.Current.Request.Form["banner"]);


                HttpFileCollection MyFileCollection = HttpContext.Current.Request.Files;
                if (MyFileCollection.Count > 0)
                {
                    try
                    {
                        var filename = MyFileCollection[0].FileName;
                        Random random = new Random();
                        var Id = random.Next(1000000, 9999999).ToString();
                        banner.Image = System.Web.HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["imagesPath"]) + Id + filename;
                        MyFileCollection[0].SaveAs(banner.Image);



                    }
                    catch (Exception ex)
                    {

                    }
                }

                Banner bannerdata = db.SaveBanner(banner);
                return Request.CreateResponse(HttpStatusCode.OK, bannerdata);
            }
            catch (Exception ex)
            {
                Banner bannerdata = new Banner();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, bannerdata);
            }
        }


        [ActionName("getbanners")]
        [HttpPost]
        public HttpResponseMessage GetBanners()
        {
            try
            {
                var bannerlist = new List<Banner>();
                bannerlist = db.GetBanners();
                foreach (Banner banner in bannerlist)
                {
                    if (File.Exists(banner.Image))
                    {
                        byte[] imgdata = System.IO.File.ReadAllBytes(banner.Image);
                        banner.ImageFile = imgdata;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, bannerlist);
            }
            catch (Exception ex)
            {
                var bannerlist = new List<Banner>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, bannerlist);
            }
        }


        [ActionName("getbannerdata")]
        [HttpPost]
        public HttpResponseMessage GetBannerById(Banner banner)
        {
            try
            {
                Banner bannerdata = db.GetBannerById(banner.Id);
                if (File.Exists(bannerdata.Image))
                {
                    byte[] imgdata = System.IO.File.ReadAllBytes(bannerdata.Image);
                    bannerdata.ImageFile = imgdata;
                }
                return Request.CreateResponse(HttpStatusCode.OK, bannerdata);
            }
            catch (Exception ex)
            {
                var bannerdata = new Banner();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, bannerdata);
            }
        }


        [ActionName("deletebanner")]
        [HttpPost]
        public HttpResponseMessage DeleteBanner(Banner banner)
        {
            try
            {
                if (File.Exists(banner.Image))
                {
                    File.Delete(banner.Image);
                }
                db.DeleteBanner(banner.Id);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }
    }
}