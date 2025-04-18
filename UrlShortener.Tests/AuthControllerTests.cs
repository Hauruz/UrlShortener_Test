using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using UrlShortener.Controllers;
using UrlShortener.Data;
using UrlShortener.Models;
using Xunit;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace UrlShortener.Tests
{
    public class AuthControllerTests
    {
        private AppDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private IConfiguration CreateConfiguration()
        {
            var inMemorySettings = new Dictionary<string, string> {
                { "Jwt:Key", "SuperSecretKey12345SuperSecretKey12345" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" }
            };
            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();
        }

        [Fact]
        public async Task Register_NewUser_ReturnsTokenAndStoresUser()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var config = CreateConfiguration();
            var controller = new AuthController(context, config);
            var dto = new LoginDto { Username = "alice", Password = "Pass123!" };

            // Act
            var result = await controller.Register(dto) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var value = result.Value;
            var tokenProp = value.GetType().GetProperty("token");
            Assert.NotNull(tokenProp);
            var token = tokenProp.GetValue(value) as string;
            Assert.False(string.IsNullOrEmpty(token), "Token should not be null or empty");
            Assert.Single(context.Users);
            Assert.Equal("alice", context.Users.First().Username);
        }

        [Fact]
        public async Task Register_DuplicateUsername_ReturnsBadRequest()
        {
            // Arrange
            var context = CreateInMemoryContext();
            context.Users.Add(new User { Username = "bob", PasswordHash = "hash", Role = "User" });
            await context.SaveChangesAsync();
            var config = CreateConfiguration();
            var controller = new AuthController(context, config);
            var dto = new LoginDto { Username = "bob", Password = "Any" };

            // Act
            var result = await controller.Register(dto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void Login_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var hasher = new PasswordHasher<User>();
            var user = new User { Username = "carol", Role = "User" };
            user.PasswordHash = hasher.HashPassword(user, "Secret1!");
            context.Users.Add(user);
            context.SaveChanges();

            var config = CreateConfiguration();
            var controller = new AuthController(context, config);
            var dto = new LoginDto { Username = "carol", Password = "Secret1!" };

            // Act
            var result = controller.Login(dto) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var value = result.Value;
            var tokenProp = value.GetType().GetProperty("token");
            Assert.NotNull(tokenProp);
            var token = tokenProp.GetValue(value) as string;
            Assert.False(string.IsNullOrEmpty(token), "Token should not be null or empty");
        }

        [Fact]
        public void Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var hasher = new PasswordHasher<User>();
            var user = new User { Username = "dave", Role = "User" };
            user.PasswordHash = hasher.HashPassword(user, "MyPass123");
            context.Users.Add(user);
            context.SaveChanges();

            var config = CreateConfiguration();
            var controller = new AuthController(context, config);
            var dto = new LoginDto { Username = "dave", Password = "WrongPass" };

            // Act
            var result = controller.Login(dto);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }
    }
}