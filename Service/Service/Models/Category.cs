﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service.Models
{
    public class Category
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public byte[] ImageFile { get; set; }
        public string Description { get; set; }
        public DateTime DatePublished { get; set; }
    }
}