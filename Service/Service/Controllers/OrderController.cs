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
    public class OrderController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("saveorder")]
        [HttpPost]
        public HttpResponseMessage SaveOrder()
        {
            try
            {
                Order order = new Order();
                order = JsonConvert.DeserializeObject<Order>(HttpContext.Current.Request.Form["order"]);
                Order orderdata = db.SaveOrder(order);
                return Request.CreateResponse(HttpStatusCode.OK, orderdata);
            }
            catch (Exception ex)
            {
                Order orderdata = new Order();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, orderdata);
            }
        }


        [ActionName("getorders")]
        [HttpPost]
        public HttpResponseMessage GetOrders()
        {
            try
            {
                var orderlist = new List<Order>();
                orderlist = db.GetOrders();
                return Request.CreateResponse(HttpStatusCode.OK, orderlist);
            }
            catch (Exception ex)
            {
                var orderlist = new List<Order>();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, orderlist);
            }
        }


        [ActionName("getorderdata")]
        [HttpPost]
        public HttpResponseMessage GetOrderById(Order order)
        {
            try
            {
                Order orderdata = db.GetOrderById(order.Id);
                return Request.CreateResponse(HttpStatusCode.OK, orderdata);
            }
            catch (Exception ex)
            {
                var orderdata = new Order();
                return Request.CreateResponse(HttpStatusCode.InternalServerError, orderdata);
            }
        }


        [ActionName("deleteorder")]
        [HttpPost]
        public HttpResponseMessage DeleteOrder(Order order)
        {
            try
            {
                db.DeleteOrder(order);
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError);
            }
        }
    }
}