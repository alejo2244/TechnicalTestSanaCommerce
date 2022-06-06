using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using TechnicalTestSanaCommerce.Models;

namespace TechnicalTestSanaCommerce.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        //crear o actualizar un producto de un archivo csv
        public ActionResult SaveProduct(Product product, string path)
        {
            try
            {
                List<Product> lsProducts = GetListProducts(path);
                if (product.IdProduct != 0)
                {
                    Product prodUpdate = lsProducts.Where(x => x.IdProduct == product.IdProduct).ToList()[0];
                    lsProducts.Remove(prodUpdate);
                    lsProducts.Add(product);
                    lsProducts = lsProducts.OrderBy(x => x.IdProduct).ToList();
                    SaveAllProducts(lsProducts, path);
                }
                else
                {
                    int idProduct = lsProducts.Count == 0 ? 1 : lsProducts.Max(x => x.IdProduct) + 1;
                    var csv = new System.Text.StringBuilder();
                    var newLine = string.Format("{0},{1},{2},{3}", idProduct, product.Number, product.Title, product.Price);
                    csv.AppendLine(newLine);

                    if (!System.IO.File.Exists(path))
                    {
                        System.IO.File.WriteAllText(path, csv.ToString());
                    }
                    else
                    {
                        System.IO.File.AppendAllText(path, csv.ToString());
                    }
                }

                return Json(true);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        //eliminar producto y actualizar el archivo csv
        public ActionResult DeleteProduct(int idProduct, string path)
        {
            try
            {
                List<Product> lsProducts = GetListProducts(path);
                if (idProduct > 0)
                {
                    Product prodUpdate = lsProducts.Where(x => x.IdProduct == idProduct).ToList()[0];
                    lsProducts.Remove(prodUpdate);
                    SaveAllProducts(lsProducts, path);
                }

                return Json(true);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public ActionResult GetProducts(string path)
        {
            return Json(GetListProducts(path));
        }

        #region Helpers
        //Obtener productos de un archivo csv
        private List<Product> GetListProducts(string path) {
            List<Product> lsProducts = new List<Product>();
            if (System.IO.File.Exists(path))
            {
                try
                {
                    string[] fileLines = System.IO.File.ReadAllLines(path);
                    foreach (string fileLine in fileLines)
                    {
                        string[] productString = fileLine.Split(',');
                        lsProducts.Add(new Product() { IdProduct = Int32.Parse(productString[0]), Number = Int32.Parse(productString[1]), Title = productString[2], Price = Int32.Parse(productString[3]) });
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return lsProducts.OrderBy(x => x.IdProduct).ToList();
        }

        //Guardar todos los productos en un archivo csv
        private bool SaveAllProducts(List<Product> products, string path)
        {
            try
            {
                List<string> data = new List<string>();
                foreach (Product product in products)
                {
                    string newLine = string.Format("{0},{1},{2},{3}", product.IdProduct, product.Number, product.Title, product.Price);
                    data.Add(newLine);
                }

                System.IO.File.WriteAllLines(path, data.ToArray());
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        #endregion
    }
}