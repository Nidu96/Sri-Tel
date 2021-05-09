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
            List<SystemPermissions> permissionlist = new List<SystemPermissions>();
            Boolean userexists = false;

            try
            {
                string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
                using (SqlConnection con1 = new SqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM SystemUser WHERE Username = @Username";
                    SqlCommand cmd1 = new SqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Username", credentials.Username);

                    SqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        while (sdr1.Read())
                        {
                            user.Id = sdr1["Id"].ToString().Trim();
                            user.Name = sdr1["Name"].ToString().Trim();
                            user.NIC = sdr1["NIC"].ToString().Trim();
                            user.DOB = sdr1["DOB"].ToString().Trim();
                            user.Address = sdr1["Address"].ToString().Trim();
                            user.Username = sdr1["Username"].ToString().Trim();
                            user.Phone = sdr1["Phone"].ToString().Trim();
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

                using (SqlConnection con2 = new SqlConnection(constr))
                {
                    if (userexists)
                    {

                        con2.Open();

                        String sql2 = "SELECT * FROM SystemUser WHERE Username = @Username AND Password = @Password";
                        SqlCommand cmd2 = new SqlCommand(sql2, con2);
                        cmd2.Parameters.AddWithValue("@Username", credentials.Username.Trim());
                        cmd2.Parameters.AddWithValue("@Password", credentials.Password.Trim());

                        SqlDataReader sdr2 = cmd2.ExecuteReader();
                        if (sdr2.HasRows)
                        {
                            while (sdr2.Read())
                            {
                                user.Id = sdr2["Id"].ToString().Trim();
                                user.Name = sdr2["Name"].ToString().Trim();
                                user.NIC = sdr2["NIC"].ToString().Trim();
                                user.DOB = sdr2["DOB"].ToString().Trim();
                                user.Address = sdr2["Address"].ToString().Trim();
                                user.Username = sdr2["Username"].ToString().Trim();
                                user.Phone = sdr2["Phone"].ToString().Trim();
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

                using (SqlConnection con3 = new SqlConnection(constr))
                {
                    if (userexists && user.Id != null)
                    {

                        con3.Open();

                        String sql3 = "SELECT * FROM Permissions WHERE UserId = @UserId";
                        SqlCommand cmd3 = new SqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@UserId", user.Id.Trim());

                        SqlDataReader sdr2 = cmd3.ExecuteReader();
                        if (sdr2.HasRows)
                        {
                            while (sdr2.Read())
                            {
                                SystemPermissions permission = new SystemPermissions();
                                permission.UserId = sdr2["UserId"].ToString().Trim();
                                permission.SystemId = sdr2["SystemId"].ToString().Trim();
                                permissionlist.Add(permission);

                            }
                        }

                        user.PermissionsList = permissionlist;
                        con3.Close();

                    }

                }
                return user;
            }catch(SqlException ex)
            {
                return user;
            }
        }


        public SystemUser SaveUser(SystemUser user)
        {
            Boolean userexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (SqlConnection con1 = new SqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM SystemUser WHERE Username = @Username";
                SqlCommand cmd1 = new SqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Username", user.Username.Trim());

                SqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    while (sdr1.Read())
                    {
                        user.Id = sdr1["Id"].ToString().Trim();
                        user.Password = sdr1["Password"].ToString().Trim();
                    }
                    userexists = true;
                }
                else
                {
                    userexists = false;
                }

                con1.Close();
            }

            using (SqlConnection con2 = new SqlConnection(constr))
            {
                if (!userexists)
                {
                    Random random = new Random();
                    user.Password = random.Next(10000, 99999).ToString();
                    user.Password = Encrypt(user.Password);
                    user.Id = random.Next(10000,99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO SystemUser(Id, Name, NIC, DOB, Address, Username, Password, Phone, Active, UserRole) " +
                        "VALUES(@Id, @Name, @NIC, @DOB, @Address, @Username, @Password, @Phone, @Active, @UserRole)";
                    SqlCommand cmd2 = new SqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", user.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Name", user.Name.Trim());
                    cmd2.Parameters.AddWithValue("@NIC", user.NIC.Trim());
                    cmd2.Parameters.AddWithValue("@DOB", user.DOB.Trim());
                    cmd2.Parameters.AddWithValue("@Address", user.Address.Trim());
                    cmd2.Parameters.AddWithValue("@Username", user.Username.Trim());
                    cmd2.Parameters.AddWithValue("@Password", user.Password.Trim());
                    cmd2.Parameters.AddWithValue("@Phone", user.Phone.Trim());
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
                        "NIC = @NIC, " +
                        "DOB = @DOB, " +
                        "Address = @Address, " +
                        "Username = @Username, " +
                        "Password = @Password, " +
                        "Phone = @Phone, " +
                        "Active = @Active, " +
                        "UserRole = @UserRole WHERE Id = @Id ";
                    SqlCommand cmd2 = new SqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", user.Id.Trim());
                    cmd2.Parameters.AddWithValue("@Name", user.Name.Trim());
                    cmd2.Parameters.AddWithValue("@NIC", user.NIC.Trim());
                    cmd2.Parameters.AddWithValue("@DOB", user.DOB.Trim());
                    cmd2.Parameters.AddWithValue("@Address", user.Address.Trim());
                    cmd2.Parameters.AddWithValue("@Username", user.Username.Trim());
                    cmd2.Parameters.AddWithValue("@Password", user.Password.Trim());
                    cmd2.Parameters.AddWithValue("@Phone", user.Phone.Trim());
                    cmd2.Parameters.AddWithValue("@Active", user.Active.Trim());
                    cmd2.Parameters.AddWithValue("@UserRole", user.UserRole.Trim());

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            
            }
            user.Password = Decrypt(user.Password);
            return user;
        }


        public void SavePermissions(SystemUser user)
        {
            try
            {
                Boolean userexists = false;

                string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
                using (SqlConnection con1 = new SqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM SystemUser WHERE Username = @Username";
                    SqlCommand cmd1 = new SqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Username", user.Username.Trim());

                    SqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        while (sdr1.Read())
                        {
                            user.Id = sdr1["Id"].ToString().Trim();
                            user.Password = sdr1["Password"].ToString().Trim();
                        }
                        userexists = true;
                    }
                    else
                    {
                        userexists = false;
                    }

                    con1.Close();
                }

                if (userexists && user.Id != null)
                {
                    if (user.PermissionsList != null)
                    {
                        using (SqlConnection con3 = new SqlConnection(constr))
                        {
                            con3.Open();

                            String sql3 = "DELETE FROM Permissions WHERE UserId = @UserId";
                            SqlCommand cmd3 = new SqlCommand(sql3, con3);
                            cmd3.Parameters.AddWithValue("@UserId", user.Id.Trim());

                            cmd3.ExecuteReader();
                            con3.Close();
                        }
                    }
                }


                int count = 0;
                if (user.PermissionsList != null)
                {

                    using (SqlConnection con4 = new SqlConnection(constr))
                    {

                        foreach (SystemPermissions item in user.PermissionsList)
                        {

                            con4.Open();

                            String sql4 = "INSERT INTO Permissions(UserId,SystemId) VALUES(@UserId,@SystemId)";
                            SqlCommand cmd4 = new SqlCommand(sql4, con4);
                            cmd4.Parameters.AddWithValue("@UserId", item.UserId.Trim());
                            cmd4.Parameters.AddWithValue("@SystemId", item.SystemId.Trim());

                            cmd4.ExecuteReader();
                            con4.Close();
                            count += 1;
                        }
                    }

                }

            }
          catch (SqlException ex)
            {

            }
        }


        public List<SystemUser> GetUsers()
        {
            var userlist = new List<SystemUser>();
            List<SystemPermissions> permissionlist = new List<SystemPermissions>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (SqlConnection con = new SqlConnection(constr))
            {
                    con.Open();

                    String sql = "SELECT * FROM SystemUser";
                    SqlCommand cmd = new SqlCommand(sql, con);

                    SqlDataReader sdr = cmd.ExecuteReader();
                    if (sdr.HasRows)
                    {
                        while (sdr.Read())
                        {
                            SystemUser user = new SystemUser();
                            user.Id = sdr["Id"].ToString().Trim();
                            user.Name = sdr["Name"].ToString().Trim();
                            user.NIC = sdr["NIC"].ToString().Trim();
                            user.DOB = sdr["DOB"].ToString().Trim();
                            user.Address = sdr["Address"].ToString().Trim();
                            user.Username = sdr["Username"].ToString().Trim();
                            user.Phone = sdr["Phone"].ToString().Trim();
                            user.Active = sdr["Active"].ToString().Trim();
                            user.UserRole = sdr["UserRole"].ToString().Trim();
                            userlist.Add(user);
                        }
                    }
                    con.Close();

            }

            using (SqlConnection con3 = new SqlConnection(constr))
            {
                foreach (SystemUser user in userlist)
                {

                    con3.Open();

                    String sql3 = "SELECT * FROM Permissions WHERE UserId = @UserId";
                    SqlCommand cmd3 = new SqlCommand(sql3, con3);
                    cmd3.Parameters.AddWithValue("@UserId", user.Id.Trim());

                    SqlDataReader sdr2 = cmd3.ExecuteReader();
                    if (sdr2.HasRows)
                    {
                        while (sdr2.Read())
                        {
                            SystemPermissions permission = new SystemPermissions();
                            permission.UserId = sdr2["UserId"].ToString().Trim();
                            permission.SystemId = sdr2["SystemId"].ToString().Trim();
                            permissionlist.Add(permission);

                        }
                    }

                    user.PermissionsList = permissionlist;
                    con3.Close();

                }

            }

            return userlist;
        }


        public SystemUser GetUserById(String id)
        {
            SystemUser user = new SystemUser();
            List<SystemPermissions> permissionlist = new List<SystemPermissions>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (SqlConnection con = new SqlConnection(constr))
            {
                con.Open();

                    String sql = "SELECT * FROM SystemUser WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Id", id.Trim());

                    SqlDataReader sdr = cmd.ExecuteReader();
                    if (sdr.HasRows)
                    {
                        while (sdr.Read())
                        {
                            user.Id = sdr["Id"].ToString().Trim();
                            user.Name = sdr["Name"].ToString().Trim();
                            user.NIC = sdr["NIC"].ToString().Trim();
                            user.DOB = sdr["DOB"].ToString().Trim();
                            user.Address = sdr["Address"].ToString().Trim();
                            user.Username = sdr["Username"].ToString().Trim();
                            user.Password = sdr["Password"].ToString().Trim();
                            user.Phone = sdr["Phone"].ToString().Trim();
                            user.Active = sdr["Active"].ToString().Trim();
                            user.UserRole = sdr["UserRole"].ToString().Trim();
                        }
                    }
                    con.Close();
            }

            using (SqlConnection con3 = new SqlConnection(constr))
            {
                    con3.Open();

                    String sql3 = "SELECT * FROM Permissions WHERE UserId = @UserId";
                    SqlCommand cmd3 = new SqlCommand(sql3, con3);
                    cmd3.Parameters.AddWithValue("@UserId", user.Id.Trim());

                    SqlDataReader sdr2 = cmd3.ExecuteReader();
                    if (sdr2.HasRows)
                    {
                        while (sdr2.Read())
                        {
                            SystemPermissions permission = new SystemPermissions();
                            permission.UserId = sdr2["UserId"].ToString().Trim();
                            permission.SystemId = sdr2["SystemId"].ToString().Trim();
                            permissionlist.Add(permission);

                        }
                    }

                    user.PermissionsList = permissionlist;
                    con3.Close();
            }
            return user;
        }


        public void DeleteUser(String id)
        {
            Boolean userexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (SqlConnection con1 = new SqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM SystemUser WHERE Id = @Id";
                SqlCommand cmd1 = new SqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                SqlDataReader sdr1 = cmd1.ExecuteReader();
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

            using (SqlConnection con2 = new SqlConnection(constr))
            {
                if (userexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM SystemUser WHERE Id = @Id";
                    SqlCommand cmd2 = new SqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }

            if (userexists)
            {
                    using (SqlConnection con3 = new SqlConnection(constr))
                    {
                        con3.Open();

                        String sql3 = "DELETE FROM Permissions WHERE UserId = @UserId";
                        SqlCommand cmd3 = new SqlCommand(sql3, con3);
                        cmd3.Parameters.AddWithValue("@UserId", id.Trim());

                        cmd3.ExecuteReader();
                        con3.Close();
                    }
            }
        }

        #endregion

        #region accesscontrol

        public AccessControl SaveAccessControl(AccessControl accesscontrol)
        {
            Boolean accesscontrolexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            if(accesscontrol.Id != null) { 
                using (SqlConnection con1 = new SqlConnection(constr))
                {

                    con1.Open();

                    String sql1 = "SELECT * FROM AccessControl WHERE Id = @Id";
                    SqlCommand cmd1 = new SqlCommand(sql1, con1);
                    cmd1.Parameters.AddWithValue("@Id", accesscontrol.Id.Trim());

                    SqlDataReader sdr1 = cmd1.ExecuteReader();
                    if (sdr1.HasRows)
                    {
                        accesscontrolexists = true;
                    }
                    else
                    {
                        accesscontrolexists = false;
                    }

                    con1.Close();
                }
            }
            else{
                accesscontrolexists = false;
            }

            if (!accesscontrolexists)
            {
                using (SqlConnection con2 = new SqlConnection(constr))
                {
                    Random random = new Random();
                    accesscontrol.Id = random.Next(10000,99999).ToString();

                    con2.Open();

                    String sql2 = "INSERT INTO AccessControl(Id, SystemName, Hyperlink, Enabled) " +
                        "VALUES(@Id, @SystemName, @Hyperlink, @Enabled)";
                    SqlCommand cmd2 = new SqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", accesscontrol.Id.Trim());
                    cmd2.Parameters.AddWithValue("@SystemName", accesscontrol.SystemName.Trim());
                    cmd2.Parameters.AddWithValue("@Hyperlink", accesscontrol.Hyperlink.Trim());
                    cmd2.Parameters.AddWithValue("@Enabled", accesscontrol.Enabled.Trim());

                    cmd2.ExecuteReader();

                    con2.Close();
                }
            }
            else
            {
                using (SqlConnection con3 = new SqlConnection(constr))
                {
                    con3.Open();

                    String sql3 = "UPDATE AccessControl SET SystemName=@SystemName, Hyperlink=@Hyperlink, Enabled=@Enabled WHERE Id = @Id";
                    SqlCommand cmd3 = new SqlCommand(sql3, con3);
                    cmd3.Parameters.AddWithValue("@Id", accesscontrol.Id.Trim());
                    cmd3.Parameters.AddWithValue("@SystemName", accesscontrol.SystemName.Trim());
                    cmd3.Parameters.AddWithValue("@Hyperlink", accesscontrol.Hyperlink.Trim());
                    cmd3.Parameters.AddWithValue("@Enabled", accesscontrol.Enabled.Trim());

                    cmd3.ExecuteReader();

                    con3.Close();
                }
            }
            return accesscontrol;
        }


        public List<AccessControl> GetAccessControls()
        {
            var accesscontrollist = new List<AccessControl>();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;

            using (SqlConnection con = new SqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM AccessControl";
                SqlCommand cmd = new SqlCommand(sql, con);

                SqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        AccessControl accesscontrol = new AccessControl();
                        accesscontrol.Id = sdr["Id"].ToString().Trim();
                        accesscontrol.SystemName = sdr["SystemName"].ToString().Trim();
                        accesscontrol.Hyperlink = sdr["Hyperlink"].ToString().Trim();
                        accesscontrol.Enabled = sdr["Enabled"].ToString().Trim();
                        accesscontrollist.Add(accesscontrol);
                    }
                }
                con.Close();

                return accesscontrollist;
            }
        }


        public AccessControl GetAccessControlById(String id)
        {
            AccessControl accesscontrol = new AccessControl();

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (SqlConnection con = new SqlConnection(constr))
            {
                con.Open();

                String sql = "SELECT * FROM AccessControl WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id.Trim());

                SqlDataReader sdr = cmd.ExecuteReader();
                if (sdr.HasRows)
                {
                    while (sdr.Read())
                    {
                        accesscontrol.Id = sdr["Id"].ToString().Trim();
                        accesscontrol.SystemName = sdr["SystemName"].ToString().Trim();
                        accesscontrol.Hyperlink = sdr["Hyperlink"].ToString().Trim();
                        accesscontrol.Enabled = sdr["Enabled"].ToString().Trim();
                    }
                }
                con.Close();

                return accesscontrol;
            }
        }


        public void DeleteAccessControl(String id)
        {
            Boolean accesscontrolexists = false;

            string constr = ConfigurationManager.ConnectionStrings["ServiceDB"].ConnectionString;
            using (SqlConnection con1 = new SqlConnection(constr))
            {

                con1.Open();

                String sql1 = "SELECT * FROM AccessControl WHERE Id = @Id";
                SqlCommand cmd1 = new SqlCommand(sql1, con1);
                cmd1.Parameters.AddWithValue("@Id", id.Trim());

                SqlDataReader sdr1 = cmd1.ExecuteReader();
                if (sdr1.HasRows)
                {
                    accesscontrolexists = true;
                }
                else
                {
                    accesscontrolexists = false;
                }

                con1.Close();
            }

            using (SqlConnection con2 = new SqlConnection(constr))
            {
                if (accesscontrolexists)
                {

                    con2.Open();

                    String sql2 = "DELETE FROM AccessControl WHERE Id = @Id";
                    SqlCommand cmd2 = new SqlCommand(sql2, con2);
                    cmd2.Parameters.AddWithValue("@Id", id.Trim());

                    cmd2.ExecuteReader();
                    con2.Close();

                }
            }
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
