using Service.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using MySql.Data.MySqlClient;

namespace Service.DAL
{
    public class DBContext : DbContext
    {
        public DBContext() :
            base("ServiceDB")
        {
        }

        public static DBContext Create()
        {
            return new DBContext();
        }

        #region user
        public SystemUser Login(Credentials credentials)
        {
            credentials.Password = Encrypt(credentials.Password);
            SystemUser user = new SystemUser();
            List<Order> orderlist = new List<Order>();
            Boolean userexists = false;

            try
            {
                string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
                using (MySqlConnection con1 = new MySqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM SystemUser WHERE Username = @Username";
                    MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Username", credentials.Username);

                    MySqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        while (sdr1.Read())
                        {
                            user.Id = sdr1["Id"].ToString().Trim();
                            user.Name = sdr1["Name"].ToString().Trim();
                            user.Username = sdr1["Username"].ToString().Trim();
                            user.Active = sdr1["Active"].ToString().Trim();
                            user.UserRole = sdr1["UserRole"].ToString().Trim();
                        }
                        userexists = true;
                    }
                    else
                    {
                        user.Username = "usernotexists";
                        user.Password = "";
                        userexists = false;
                    }

                    con1.Close();
                }

                using (MySqlConnection con2 = new MySqlConnection(constr))
                {
                    if (userexists)
                    {

                        con2.Open();

                        String sql2 = "SELECT * FROM SystemUser WHERE Username = @Username AND Password = @Password";
                        MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                        cmd2.Parameters.AddWithValue("@Username", credentials.Username.Trim());
                        cmd2.Parameters.AddWithValue("@Password", credentials.Password.Trim());

                        MySqlDataReader sdr2 = cmd2.ExecuteReader();
                        if (sdr2.HasRows)
                        {
                            while (sdr2.Read())
                            {
                                user.Id = sdr2["Id"].ToString().Trim();
                                user.Name = sdr2["Name"].ToString().Trim();
                                user.Username = sdr2["Username"].ToString().Trim();
                                user.Active = sdr2["Active"].ToString().Trim();
                                user.UserRole = sdr2["UserRole"].ToString().Trim();
                            }
                        }
                        else
                        {
                            user.Username = credentials.Username;
                            user.Password = "invalid";
                        }
                        con2.Close();

                    }
                }
                return user;
            }catch(SqlException ex)
            {
                return user;
            }
        }

        public Boolean CheckUserExist(SystemUser user)
        {
            Boolean userexists = false;
            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM SystemUser WHERE Username = @Username";
                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Username", user.Username.Trim());

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    userexists = true;
                }
                con.Close();
            }
            return userexists;
        }

        public SystemUser SaveUser(SystemUser user)
        {
            Boolean userexists = false;
            user.Password = Encrypt(user.Password);

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM SystemUser WHERE Username = @Username";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Username", user.Username.Trim());

                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    while (sdr1.Read())
                    {
                        user.Id = sdr1["Id"].ToString().Trim();
                    }
                    userexists = true;
                }
                else
                {
                    userexists = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
                if (!userexists)
                {
                    Random random = new Random();
                    user.Id = random.Next(1000000,9999999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO SystemUser(Id, Name, Username, Password, Active, UserRole) " +
                        "VALUES(@Id, @Name, @Username, @Password, @Active, @UserRole)";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", user.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Name", user.Name.Trim());
                    cmd2.Parameters.AddWithValue("@Username", user.Username.Trim());
                    cmd2.Parameters.AddWithValue("@Password", user.Password.Trim());
                    cmd2.Parameters.AddWithValue("@Active", user.Active.Trim());
                    cmd2.Parameters.AddWithValue("@UserRole", user.UserRole.Trim());

                    cmd2.ExecuteReader();
  
                    con2.Close();

                }
                else
                {
                    con2.Open();

                    String sql2 = "UPDATE SystemUser SET " +
                        "Name = @Name, " +
                        "Username = @Username, " +
                        "Password = @Password, " +
                        "Active = @Active, " +
                        "UserRole = @UserRole WHERE Id = @Id ";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", user.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Name", user.Name.Trim());
                    cmd2.Parameters.AddWithValue("@Username", user.Username.Trim());
                    cmd2.Parameters.AddWithValue("@Password", user.Password.Trim());
                    cmd2.Parameters.AddWithValue("@Active", user.Active.Trim());
                    cmd2.Parameters.AddWithValue("@UserRole", user.UserRole.Trim());

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            
            }
            user.Password = Decrypt(user.Password);
            return user;
        }

        public List<SystemUser> GetUsers()
        {
            var userlist = new List<SystemUser>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (MySqlConnection con = new MySqlConnection(constr))
            {
                    con.Open();

                    String sql = "SELECT * FROM SystemUser";
                    MySqlCommand cmd = new MySqlCommand(sql, con);

                    MySqlDataReader sdr = cmd.ExecuteReader();
                    if (sdr.HasRows)
                    {
                        while (sdr.Read())
                        {
                            SystemUser user = new SystemUser();
                            user.Id = sdr["Id"].ToString().Trim();
                            user.Name = sdr["Name"].ToString().Trim();
                            user.Username = sdr["Username"].ToString().Trim();
                            user.Active = sdr["Active"].ToString().Trim();
                            user.UserRole = sdr["UserRole"].ToString().Trim();
                            userlist.Add(user);
                        }
                    }
                    con.Close();

            }
            return userlist;
        }

        public SystemUser GetUserById(String id)
        {
            SystemUser user = new SystemUser();
            List<Order> orderlist = new List<Order>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                    String sql = "SELECT * FROM SystemUser WHERE Id = @Id";
                    MySqlCommand cmd = new MySqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Id", id.Trim());

                    MySqlDataReader sdr = cmd.ExecuteReader();
                    if (sdr.HasRows)
                    {
                        while (sdr.Read())
                        {
                            user.Id = sdr["Id"].ToString().Trim();
                            user.Name = sdr["Name"].ToString().Trim();
                            user.Username = sdr["Username"].ToString().Trim();
                            user.Password = sdr["Password"].ToString().Trim();
                            user.Active = sdr["Active"].ToString().Trim();
                            user.UserRole = sdr["UserRole"].ToString().Trim();
                        }
                    }
                    con.Close();
            }

            user.Password = Decrypt(user.Password);
            return user;
        }

        public void DeleteUser(String id)
        {
            Boolean userexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM SystemUser WHERE Id = @Id";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    userexists = true;
                }
                else
                {
                    userexists = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
                if (userexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM SystemUser WHERE Id = @Id";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }
        }

        #endregion

        #region category
        public Category SaveCategory(Category category)
        {
            Boolean categoryexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            if (category.Id != null)
            {
                using (MySqlConnection con1 = new MySqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM Category WHERE Id = @Id";
                    MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Id", category.Id.Trim());

                    MySqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        categoryexists = true;
                    }
                    else
                    {
                        categoryexists = false;
                    }

                    con1.Close();
                }
            }
            else
            {
                categoryexists = false;
            }

            if (!categoryexists)
            {
                using (MySqlConnection con2 = new MySqlConnection(constr))
                {
                    Random random = new Random();
                    category.Id = random.Next(10000, 99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO Category (Id, Image, Title, Description, DatePublished) " +
                        "VALUES(@Id, @Image, @Title, @Description, @DatePublished)";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", category.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Title", category.Title.Trim());
                    cmd2.Parameters.AddWithValue("@Image", category.Image.Trim());
                    cmd2.Parameters.AddWithValue("@Description", category.Description.Trim());
                    cmd2.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(category.DatePublished));

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            }
            else
            {
                using (MySqlConnection con3 = new MySqlConnection(constr))
                {
                    con3.Open();

                    if (category.Image == null)
                    {
                        String sql3 = "UPDATE Category SET Title=@Title, Description=@Description, DatePublished=@DatePublished WHERE Id = @Id";
                        MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@Id", category.Id.Trim());
                        cmd3.Parameters.AddWithValue("@Title", category.Title.Trim());
                        cmd3.Parameters.AddWithValue("@Description", category.Description.Trim());
                        cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(category.DatePublished));

                        cmd3.ExecuteReader();
                    }
                    else
                    {
                        String sql3 = "UPDATE Category SET Title=@Title, Image=@Image, Description=@Description, DatePublished=@DatePublished WHERE Id = @Id";
                        MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@Id", category.Id.Trim());
                        cmd3.Parameters.AddWithValue("@Title", category.Title.Trim());
                        cmd3.Parameters.AddWithValue("@Image", category.Image.Trim());
                        cmd3.Parameters.AddWithValue("@Description", category.Description.Trim());
                        cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(category.DatePublished));

                        cmd3.ExecuteReader();
                    }


                    con3.Close();
                }
            }
            return category;
        }


        public List<Category> GetCategories()
        {
            var categorylist = new List<Category>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Category ORDER BY DatePublished DESC";
                MySqlCommand cmd = new MySqlCommand(sql, con);

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        Category category = new Category();
                        category.Id = sdr["Id"].ToString().Trim();
                        category.Title = sdr["Title"].ToString().Trim();
                        category.Image = sdr["Image"].ToString().Trim();
                        category.Description = sdr["Description"].ToString().Trim();
                        category.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                        categorylist.Add(category);
                    }
                }
                con.Close();

                return categorylist;
            }
        }


        public Category GetCategoryById(String id)
        {
            Category category = new Category();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Category WHERE Id = @Id";
                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        category.Id = sdr["Id"].ToString().Trim();
                        category.Title = sdr["Title"].ToString().Trim();
                        category.Image = sdr["Image"].ToString().Trim();
                        category.Description = sdr["Description"].ToString().Trim();
                        category.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                    }
                }
                con.Close();

                return category;
            }
        }


        public void DeleteCategory(String id)
        {
            Boolean categoryexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM Category WHERE Id = @Id";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    categoryexists = true;
                }
                else
                {
                    categoryexists = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
                if (categoryexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM Category WHERE Id = @Id";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }
        }

        #endregion

        #region banner
        public Banner SaveBanner(Banner banner)
        {
            Boolean bannerexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            if (banner.Id != null)
            {
                using (MySqlConnection con1 = new MySqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM Banner WHERE Id = @Id";
                    MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Id", banner.Id.Trim());

                    MySqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        bannerexists = true;
                    }
                    else
                    {
                        bannerexists = false;
                    }

                    con1.Close();
                }
            }
            else
            {
                bannerexists = false;
            }

            if (!bannerexists)
            {
                using (MySqlConnection con2 = new MySqlConnection(constr))
                {
                    Random random = new Random();
                    banner.Id = random.Next(10000, 99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO Banner (Id, Image, Title, Description, DatePublished) " +
                        "VALUES(@Id, @Image, @Title, @Description, @DatePublished)";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", banner.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Title", banner.Title.Trim());
                    cmd2.Parameters.AddWithValue("@Image", banner.Image.Trim());
                    cmd2.Parameters.AddWithValue("@Description", banner.Description.Trim());
                    cmd2.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(banner.DatePublished));

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            }
            else
            {
                using (MySqlConnection con3 = new MySqlConnection(constr))
                {
                    con3.Open();

                    if (banner.Image == null)
                    {
                        String sql3 = "UPDATE Product SET Title=@Title, Description=@Description, DatePublished=@DatePublished WHERE Id = @Id";
                        MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@Id", banner.Id.Trim());
                        cmd3.Parameters.AddWithValue("@Title", banner.Title.Trim());
                        cmd3.Parameters.AddWithValue("@Description", banner.Description.Trim());
                        cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(banner.DatePublished));

                        cmd3.ExecuteReader();
                    }
                    else
                    {
                        String sql3 = "UPDATE Product SET Title=@Title, Image=@Image, Description=@Description, DatePublished=@DatePublished WHERE Id = @Id";
                        MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@Id", banner.Id.Trim());
                        cmd3.Parameters.AddWithValue("@Title", banner.Title.Trim());
                        cmd3.Parameters.AddWithValue("@Image", banner.Image.Trim());
                        cmd3.Parameters.AddWithValue("@Description", banner.Description.Trim());
                        cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(banner.DatePublished));

                        cmd3.ExecuteReader();
                    }


                    con3.Close();
                }
            }
            return banner;
        }


        public List<Banner> GetBanners()
        {
            var bannerlist = new List<Banner>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Banner ORDER BY DatePublished DESC";
                MySqlCommand cmd = new MySqlCommand(sql, con);

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        Banner banner = new Banner();
                        banner.Id = sdr["Id"].ToString().Trim();
                        banner.Title = sdr["Title"].ToString().Trim();
                        banner.Image = sdr["Image"].ToString().Trim();
                        banner.Description = sdr["Description"].ToString().Trim();
                        banner.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                        bannerlist.Add(banner);
                    }
                }
                con.Close();

                return bannerlist;
            }
        }


        public Banner GetBannerById(String id)
        {
            Banner banner = new Banner();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Banner WHERE Id = @Id";
                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        banner.Id = sdr["Id"].ToString().Trim();
                        banner.Title = sdr["Title"].ToString().Trim();
                        banner.Image = sdr["Image"].ToString().Trim();
                        banner.Description = sdr["Description"].ToString().Trim();
                        banner.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                    }
                }
                con.Close();

                return banner;
            }
        }


        public void DeleteBanner(String id)
        {
            Boolean bannerexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM Banner WHERE Id = @Id";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    bannerexists = true;
                }
                else
                {
                    bannerexists = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
                if (bannerexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM Banner WHERE Id = @Id";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }
        }

        #endregion

        #region product
        public Product SaveProduct(Product product)
        {
            Boolean productexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            if (product.Id != null)
            {
                using (MySqlConnection con1 = new MySqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM Product WHERE Id = @Id";
                    MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Id", product.Id.Trim());

                    MySqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        productexists = true;
                    }
                    else
                    {
                        productexists = false;
                    }

                    con1.Close();
                }
            }
            else
            {
                productexists = false;
            }

            if (!productexists)
            {
                using (MySqlConnection con2 = new MySqlConnection(constr))
                {
                    Random random = new Random();
                    product.Id = random.Next(10000, 99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO Product (Id, Image, Title, Category, Description, DatePublished) " +
                        "VALUES(@Id, @Image, @Title, @Category, @Description, @DatePublished)";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", product.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Title", product.Title.Trim());
                    cmd2.Parameters.AddWithValue("@Image", product.Image.Trim());
                    cmd2.Parameters.AddWithValue("@Category", product.Category.Trim());
                    cmd2.Parameters.AddWithValue("@Description", product.Description.Trim());
                    cmd2.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(product.DatePublished));

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            }
            else
            {
                using (MySqlConnection con3 = new MySqlConnection(constr))
                {
                    con3.Open();

                    if(product.Image == null)
                    {
                        String sql3 = "UPDATE Product SET Title=@Title, Category=@Category, Description=@Description, DatePublished=@DatePublished WHERE Id = @Id";
                        MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@Id", product.Id.Trim());
                        cmd3.Parameters.AddWithValue("@Title", product.Title.Trim());
                        cmd3.Parameters.AddWithValue("@Category", product.Category.Trim());
                        cmd3.Parameters.AddWithValue("@Description", product.Description.Trim());
                        cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(product.DatePublished));

                        cmd3.ExecuteReader();
                    }
                    else
                    {
                        String sql3 = "UPDATE Product SET Title=@Title, Image=@Image, Category=@Category, Description=@Description, DatePublished=@DatePublished WHERE Id = @Id";
                        MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@Id", product.Id.Trim());
                        cmd3.Parameters.AddWithValue("@Title", product.Title.Trim());
                        cmd3.Parameters.AddWithValue("@Image", product.Image.Trim());
                        cmd3.Parameters.AddWithValue("@Category", product.Category.Trim());
                        cmd3.Parameters.AddWithValue("@Description", product.Description.Trim());
                        cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(product.DatePublished));

                        cmd3.ExecuteReader();
                    }


                    con3.Close();
                }
            }
            return product;
        }


        public List<Product> GetProducts()
        {
            var productlist = new List<Product>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Product ORDER BY DatePublished DESC";
                MySqlCommand cmd = new MySqlCommand(sql, con);

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        Product product = new Product();
                        product.Id = sdr["Id"].ToString().Trim();
                        product.Title = sdr["Title"].ToString().Trim();
                        product.Image = sdr["Image"].ToString().Trim();
                        product.Category = sdr["Category"].ToString().Trim();
                        product.Description = sdr["Description"].ToString().Trim();
                        product.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                        productlist.Add(product);
                    }
                }
                con.Close();

                return productlist;
            }
        }


        public Product GetProductById(String id)
        {
            Product product = new Product();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Product WHERE Id = @Id";
                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        product.Id = sdr["Id"].ToString().Trim();
                        product.Title = sdr["Title"].ToString().Trim();
                        product.Image = sdr["Image"].ToString().Trim();
                        product.Category = sdr["Category"].ToString().Trim();
                        product.Description = sdr["Description"].ToString().Trim();
                        product.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                    }
                }
                con.Close();

                return product;
            }
        }


        public void DeleteProduct(String id)
        {
            Boolean productexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM Product WHERE Id = @Id";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    productexists = true;
                }
                else
                {
                    productexists = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
                if (productexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM Product WHERE Id = @Id";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }
        }

        #endregion

        #region tutorial
        public Tutorial SaveTutorial(Tutorial tutorial)
        {
            Boolean tutorialexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            if (tutorial.Id != null)
            {
                using (MySqlConnection con1 = new MySqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM Tutorial WHERE Id = @Id";
                    MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Id", tutorial.Id.Trim());

                    MySqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        tutorialexists = true;
                    }
                    else
                    {
                        tutorialexists = false;
                    }

                    con1.Close();
                }
            }
            else
            {
                tutorialexists = false;
            }

            if (!tutorialexists)
            {
                using (MySqlConnection con2 = new MySqlConnection(constr))
                {
                    Random random = new Random();
                    tutorial.Id = random.Next(10000, 99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO Tutorial (Id, Video, Title, Description, Price, DatePublished, StripeProductKey) " +
                        "VALUES(@Id, @Video, @Title, @Description, @Price, @DatePublished, @StripeProductKey)";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", tutorial.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Title", tutorial.Title.Trim());
                    cmd2.Parameters.AddWithValue("@Video", tutorial.Video.Trim());
                    cmd2.Parameters.AddWithValue("@Description", tutorial.Description.Trim());
                    cmd2.Parameters.AddWithValue("@Price", Convert.ToInt32(tutorial.Price));
                    cmd2.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(tutorial.DatePublished));
                    cmd2.Parameters.AddWithValue("@StripeProductKey", tutorial.StripeProductKey.Trim());

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            }
            else
            {
                using (MySqlConnection con3 = new MySqlConnection(constr))
                {
                    con3.Open();

                    String sql3 = "UPDATE Tutorial SET Title=@Title, Video=@Video, Description=@Description, Price=@Price, DatePublished=@DatePublished WHERE Id = @Id";
                    MySqlCommand cmd3 = new MySqlCommand(sql3, con3);
                    cmd3.Parameters.AddWithValue("@Id", tutorial.Id.Trim());
                    cmd3.Parameters.AddWithValue("@Title", tutorial.Title.Trim());
                    cmd3.Parameters.AddWithValue("@Video", tutorial.Video.Trim());
                    cmd3.Parameters.AddWithValue("@Description", tutorial.Description.Trim());
                    cmd3.Parameters.AddWithValue("@Price", Convert.ToInt32(tutorial.Price));
                    cmd3.Parameters.AddWithValue("@DatePublished", Convert.ToDateTime(tutorial.DatePublished));

                    cmd3.ExecuteReader();

                    con3.Close();
                }
            }
            return tutorial;
        }


        public List<Tutorial> GetTutorials()
        {
            var tutoriallist = new List<Tutorial>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Tutorial ORDER BY DatePublished DESC";
                MySqlCommand cmd = new MySqlCommand(sql, con);

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        Tutorial tutorial = new Tutorial();
                        tutorial.Id = sdr["Id"].ToString().Trim();
                        tutorial.Title = sdr["Title"].ToString().Trim();
                        tutorial.Video = sdr["Video"].ToString().Trim();
                        tutorial.Description = sdr["Description"].ToString().Trim();
                        tutorial.StripeProductKey = sdr["StripeProductKey"].ToString().Trim();
                        tutorial.Price = Convert.ToInt32(sdr["Price"]);
                        tutorial.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                        tutoriallist.Add(tutorial);
                    }
                }
                con.Close();

                return tutoriallist;
            }
        }


        public Tutorial GetTutorialById(String id)
        {
            Tutorial tutorial = new Tutorial();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Tutorial WHERE Id = @Id";
                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        tutorial.Id = sdr["Id"].ToString().Trim();
                        tutorial.Title = sdr["Title"].ToString().Trim();
                        tutorial.Video = sdr["Video"].ToString().Trim();
                        tutorial.Description = sdr["Description"].ToString().Trim();
                        tutorial.StripeProductKey = sdr["StripeProductKey"].ToString().Trim();
                        tutorial.Price = Convert.ToInt32(sdr["Price"]);
                        tutorial.DatePublished = Convert.ToDateTime(sdr["DatePublished"]);
                    }
                }
                con.Close();

                return tutorial;
            }
        }


        public void DeleteTutorial(String id)
        {
            Boolean tutorialexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM Tutorial WHERE Id = @Id";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    tutorialexists = true;
                }
                else
                {
                    tutorialexists = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
                if (tutorialexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM Tutorial WHERE Id = @Id";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }
        }

        #endregion

        #region orders

        public List<Order> GetOrders()
        {
            var orderlist = new List<Order>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Order";
                MySqlCommand cmd = new MySqlCommand(sql, con);

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        Order order = new Order();
                        order.Id = sdr["Id"].ToString().Trim();
                        order.UserEmail = sdr["UserEmail"].ToString().Trim();
                        order.ProductId = sdr["ProductId"].ToString().Trim();
                        order.DateOfPayment = Convert.ToDateTime(sdr["DateOfPayment"]);
                        orderlist.Add(order);
                    }
                }
                con.Close();

            }
            return orderlist;
        }

        public Order GetOrderById(String id)
        {
            Order order = new Order();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con = new MySqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM Order WHERE Id = @Id";
                MySqlCommand cmd = new MySqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id.Trim());

                MySqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        order.Id = sdr["Id"].ToString().Trim();
                        order.UserEmail = sdr["UserEmail"].ToString().Trim();
                        order.ProductId = sdr["ProductId"].ToString().Trim();
                        order.DateOfPayment = Convert.ToDateTime(sdr["DateOfPayment"]);
                    }
                }
                con.Close();
            }
            return order;
        }

        public Order SaveOrder(Order order)
        {

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

                using (MySqlConnection con2 = new MySqlConnection(constr))
                {
                    Random random = new Random();
                    order.Id = random.Next(10000, 99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO Order (Id, UserEmail, ProductId, DateOfPayment) " +
                        "VALUES(@Id, @UserEmail, @ProductId, @DateOfPayment)";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", order.Id.Trim());
                    cmd2.Parameters.AddWithValue("@UserEmail", order.UserEmail.Trim());
                    cmd2.Parameters.AddWithValue("@ProductId", order.ProductId.Trim());
                    cmd2.Parameters.AddWithValue("@DateOfPayment", Convert.ToDateTime(order.DateOfPayment));

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            
            return order;
        }

        public void DeleteOrder(Order order)
        {
            Boolean orderexist = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (MySqlConnection con1 = new MySqlConnection(constr))
             {
                con1.Open();

                String sql1 = "SELECT * FROM Order WHERE Id = @Id";
                MySqlCommand cmd1 = new MySqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", order.Id.Trim());
                MySqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    orderexist = true;
                }
                else
                {
                    orderexist = false;
                }

                con1.Close();
            }

            using (MySqlConnection con2 = new MySqlConnection(constr))
            {
               if (orderexist)
               {
                    con2.Open();
                    String sql2 = "DELETE FROM Order WHERE Id = @Id";
                    MySqlCommand cmd2 = new MySqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", order.Id.Trim());
                    cmd2.ExecuteReader();
                    con2.Close();
               }
            }
            return;
        }
        #endregion

        #region decrypting
        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "app0000";
            cipherText = cipherText.Replace(" ", "+");
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }
        #endregion

        #region encrypting
        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "app0000";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
        #endregion
        public System.Data.Entity.DbSet<Service.Models.SystemUser> SystemUsers { get; set; }
    }
}
