using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Owin;
using Newtonsoft.Json;
using Service.DAL;
using Service.Models;
using Stripe;
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
    public class TutorialController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("savetutorial")]
        [HttpPost]
        public HttpResponseMessage SaveTutorial()
        {
            try
            {
                Tutorial tutorial = new Tutorial();
                tutorial = JsonConvert.DeserializeObject<Tutorial>(HttpContext.Current.Request.Form["tutorial"]);

                HttpFileCollection MyFileCollection = HttpContext.Current.Request.Files;
                if (MyFileCollection.Count > 0)
                {
                    var filename = MyFileCollection[0].FileName;
                    var videopath = System.Web.HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["tutorialsPath"]) + filename;
                    MyFileCollection[0].SaveAs(videopath);

                    if(tutorial.StripeProductKey == null)
                    {
                        StripeConfiguration.ApiKey = ConfigurationManager.AppSettings["stripeAPIKey"];
                        var productoptions = new ProductCreateOptions
                        {
                            Name = tutorial.Title
                        };
                        var productservice = new ProductService();
                        Stripe.Product productresponse = productservice.Create(productoptions);

                        tutorial.StripeProductKey = productresponse.Id;
                    }

                    //upload video to azure
                    string connString = ConfigurationManager.AppSettings["azureConnectionstring"];


                    //delete current tutorial if exists
                    BlobServiceClient blobServiceClient = new BlobServiceClient(connString);
                    BlobContainerClient cont = blobServiceClient.GetBlobContainerClient("tutorials");
                    cont.GetBlobClient(filename).DeleteIfExists();

                    //upload the new tutorial
                    BlobHttpHeaders blobHttpHeaders = new BlobHttpHeaders()
                    {
                        ContentType = "video/mp4"
                    };
                    BlobClient blobClient = new BlobClient(connString, "tutorials", filename);
                    blobClient.Upload(videopath, blobHttpHeaders);
                    var blobUrl = blobClient.Uri.AbsoluteUri;
                    tutorial.Video = blobUrl;
                    tutorial = db.SaveTutorial(tutorial);

                    if (System.IO.File.Exists(videopath) && blobUrl != null)
                    {
                        System.IO.File.Delete(videopath);
                    }
                } 

                return Request.CreateResponse(HttpStatusCode.OK, tutorial);
            }
            catch (Exception ex)
            {
                Tutorial tutorialdata = new Tutorial();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }


        [ActionName("gettutorials")]
        [HttpPost]
        public HttpResponseMessage GetTutorials()
        {
            try
            {
                var tutoriallist = new List<Tutorial>();
                tutoriallist = db.GetTutorials();
                return Request.CreateResponse(HttpStatusCode.OK, tutoriallist);
            }
            catch (Exception ex)
            {
                var tutoriallist = new List<Tutorial>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, tutoriallist);
            }
        }


        [ActionName("gettutorialdata")]
        [HttpPost]
        public HttpResponseMessage GetTutorialById(Tutorial tutorial)
        {
            try
            {
                Tutorial tutorialdata = db.GetTutorialById(tutorial.Id);
                return Request.CreateResponse(HttpStatusCode.OK, tutorialdata);
            }
            catch (Exception ex)
            {
                var tutorialdata = new Tutorial();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, tutorialdata);
            }
        }


        [ActionName("deletetutorial")]
        [HttpPost]
        public HttpResponseMessage DeleteTutorial(Tutorial tutorial)
        {
            try
            {
                //delete from stripe
                StripeConfiguration.ApiKey = ConfigurationManager.AppSettings["stripeAPIKey"];
                var service = new ProductService();
                service.Delete(tutorial.StripeProductKey);


                //delete from cloud storage
                string connString = ConfigurationManager.AppSettings["azureConnectionstring"];
                BlobServiceClient blobServiceClient = new BlobServiceClient(connString);
                BlobContainerClient cont = blobServiceClient.GetBlobContainerClient("tutorials");
                string[] tokens = tutorial.Video.Split('/');
                cont.GetBlobClient(tokens[tokens.Length - 1]).DeleteIfExists();
                db.DeleteTutorial(tutorial.Id);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }
    }
}