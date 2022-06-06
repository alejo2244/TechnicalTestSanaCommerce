using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TechnicalTestSanaCommerce.Models
{
    public class Product
    {
        public int IdProduct { get; set; }
        public int Number { get; set; }
        public string Title { get; set; }
        public int Price { get; set; }
    }
}