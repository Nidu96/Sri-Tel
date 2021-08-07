using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service.Models
{
    public class Order
    {
        public string Id { get; set; }
        public string UserEmail { get; set; }
        public string ProductId { get; set; }
        public DateTime DateOfPayment { get; set; }
    }
}