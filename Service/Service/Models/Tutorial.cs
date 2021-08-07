using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service.Models
{
    public class Tutorial
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Video { get; set; }
        public byte[] VideoFile { get; set; }
        public string Description { get; set; }
        public Int32 Price { get; set; }
        public DateTime DatePublished { get; set; }
        public string StripeProductKey { get; set; }       
    }
}