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

        // Creating get and set methods for NIC
        public string NIC { get; set; }

        // Creating get and set methods for DOB
        public string DOB { get; set; }

        // Creating get and set methods for Address
        public string Address { get; set; }

        // Creating get and set methods for Username
        public string Username { get; set; }

        // Creating get and set methods for Password
        public string Password { get; set; }

        // Creating get and set methods for Phone
        public string Phone { get; set; }

        // Creating get and set methods for Active
        public string Active { get; set; }

        // Creating get and set methods for UserRole
        public string UserRole { get; set; }

        // Creating get and set methods for PermissionsList
        public List<SystemPermissions> PermissionsList{ get; set; }

        // Creating get and set methods for OTP
        public string OTP { get; set; }

        // Creating get and set methods for Error
        public string Error { get; set; }
    }
}