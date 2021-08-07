using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Service.Models
{
    public class SystemUser
    {
        // Creating get and set methods for Id
        public string Id { get; set; }

        // Creating get and set methods for Name
        public string Name { get; set; }

        // Creating get and set methods for Username
        public string Username { get; set; }

        // Creating get and set methods for Password
        public string Password { get; set; }

        // Creating get and set methods for Active
        public string Active { get; set; }

        // Creating get and set methods for UserRole
        public string UserRole { get; set; }

        // Creating get and set methods for PermissionsList
        public List<Order> PermissionsList{ get; set; }

        // Creating get and set methods for Error
        public string Error { get; set; }
    }
}