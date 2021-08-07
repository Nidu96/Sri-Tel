using Newtonsoft.Json;
using Service.DAL;
using Service.Models;
using Stripe;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Service.Controllers
{
    public class PaymentController : ApiController
    {
        private DBContext db = new DBContext();

        [ActionName("payment")]
        [HttpPost]
        public HttpResponseMessage Payment()
        {
            try
            {
                Payment payment = new Payment();
                payment = JsonConvert.DeserializeObject<Payment>(HttpContext.Current.Request.Form["payment"]);

                SystemUser user = new SystemUser();
                user = JsonConvert.DeserializeObject<SystemUser>(HttpContext.Current.Request.Form["user"]);

                StripeConfiguration.ApiKey = ConfigurationManager.AppSettings["stripeAPIKey"];

                //get card token
                var tokenoptions = new TokenCreateOptions
                {
                    Card = new TokenCardOptions
                    {
                        Number = payment.CardNumber,
                        ExpMonth = payment.ExpMonth,
                        ExpYear = payment.ExpYear,
                        Cvc = payment.CVV
                    },
                };
                var tokenservice = new TokenService();
                Stripe.Token tokenresponse = tokenservice.Create(tokenoptions);


                ////create customer
                //var customeroptions = new CustomerCreateOptions
                //{
                //    Name = user.Name,
                //    Email = user.Username
                //};
                //var customerservice = new CustomerService();
                //Stripe.Customer customerresponse = customerservice.Create(customeroptions);


                ////create price
                //var priceoptions = new PriceCreateOptions
                //{
                //    UnitAmount = payment.Price,
                //    Currency = "cad",
                //    Product = payment.StripeProductKey,
                //};
                //var priceservice = new PriceService();
                //Stripe.Price priceresponse = priceservice.Create(priceoptions);


                //charge customer
                var chargeoptions = new ChargeCreateOptions
                {
                    Amount = payment.Price,
                    Currency = "cad",
                    Source = tokenresponse.Id,
                    ReceiptEmail = user.Username,
                    Description = "Customer - " + user.Name,
                };
                var chargeservice = new ChargeService();
                Stripe.Charge chargeresponse = chargeservice.Create(chargeoptions);


                ////create invoice
                //var invoiceitemoptions = new InvoiceItemCreateOptions
                //{
                //    Customer = customerresponse.Id,
                //    Price = priceresponse.Id
                //};
                //var invoiceitemservice = new InvoiceItemService();
                //Stripe.InvoiceItem invoiceitemresponse = invoiceitemservice.Create(invoiceitemoptions);


                //var invoiceoptions = new InvoiceCreateOptions
                //{
                //    Customer = customerresponse.Id,
                //    DaysUntilDue = 30,
                //    CollectionMethod = "send_invoice",
                //};
                //var invoiceservice = new InvoiceService();
                //Invoice invoice = invoiceservice.Create(invoiceoptions);
                //var sendinvoiceoptions = new InvoiceSendOptions { };


                if (chargeresponse.Status == "succeeded")
                {
                    var order = new Models.Order();
                    order.DateOfPayment = chargeresponse.Created;
                    order.UserEmail = payment.UserEmail;
                    order.ProductId = payment.ProductId;
                    db.SaveOrder(order);
                    //invoiceservice.SendInvoice(invoice.Id, sendinvoiceoptions);
                    return Request.CreateResponse(HttpStatusCode.OK, chargeresponse.Status);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, chargeresponse.Status);
                }
                
                
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(ex);
            }
        }
    }
}