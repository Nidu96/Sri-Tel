using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service.Models
{
    public class Payment
    {
        public string Id { get; set; }
        public string UserEmail { get; set; }
        public string ProductId { get; set; }
        public string StripeProductKey { get; set; }
        public DateTime DateOfPayment { get; set; }
        public long Price { get; set; }
        public string NameOnCard { get; set; }
        public string CardNumber { get; set; }
        public long ExpYear { get; set; }
        public long ExpMonth { get; set; }
        public string CVV { get; set; }
        public string Email { get; set; }
        public int CurrencyId { get; set; }
        public string TransactionId { get; set; }
    }
}