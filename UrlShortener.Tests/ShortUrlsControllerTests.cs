using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;
using UrlShortener.Controllers;
using UrlShortener.Data;
using UrlShortener.Models;

namespace UrlShortener.Tests
{
    public class ShortUrlsControllerTests
    {
        private AppDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private IConfiguration CreateConfiguration() => null;

        [Fact]
        public async Task GetAll_ReturnsAllEntries()
        {
            // Arrange
            var context = CreateInMemoryContext();
            context.ShortUrls.AddRange(new List<ShortUrl>
            {
                new ShortUrl { Id = 1, OriginalUrl = "http://a", ShortCode = "a1", CreatedBy = "u1", CreatedAt = DateTime.UtcNow },
                new ShortUrl { Id = 2, OriginalUrl = "http://b", ShortCode = "b2", CreatedBy = "u2", CreatedAt = DateTime.UtcNow }
            });
            await context.SaveChangesAsync();
            var controller = new ShortUrlsController(context);

            // Act
            var ok = await controller.GetAll() as OkObjectResult;

            // Assert
            Assert.NotNull(ok);
            var list = Assert.IsType<List<ShortUrl>>(ok.Value);
            Assert.Equal(2, list.Count);
        }

        [Fact]
        public async Task GetById_UnknownId_ReturnsNotFound()
        {
            var context = CreateInMemoryContext();
            var controller = new ShortUrlsController(context);

            var res = await controller.GetById(999);
            Assert.IsType<NotFoundResult>(res);
        }

        [Fact]
        public async Task Lookup_KnownCode_ReturnsEntry()
        {
            var context = CreateInMemoryContext();
            context.ShortUrls.Add(new ShortUrl { Id = 3, OriginalUrl = "http://c", ShortCode = "c3", CreatedBy = "u3", CreatedAt = DateTime.UtcNow });
            await context.SaveChangesAsync();
            var controller = new ShortUrlsController(context);

            var ok = await controller.Lookup("c3") as OkObjectResult;
            Assert.NotNull(ok);
            var entry = Assert.IsType<ShortUrl>(ok.Value);
            Assert.Equal("http://c", entry.OriginalUrl);
        }

        [Fact]
        public async Task Create_DuplicateUrl_ReturnsBadRequest()
        {
            var context = CreateInMemoryContext();
            context.ShortUrls.Add(new ShortUrl { Id = 4, OriginalUrl = "http://d", ShortCode = "d4", CreatedBy = "u4", CreatedAt = DateTime.UtcNow });
            await context.SaveChangesAsync();
            var controller = new ShortUrlsController(context);
            var model = new ShortUrl { OriginalUrl = "http://d" };

            var res = await controller.Create(model);
            Assert.IsType<BadRequestObjectResult>(res);
        }

        [Fact]
        public async Task Delete_Nonexistent_ReturnsNotFound()
        {
            var context = CreateInMemoryContext();
            var controller = new ShortUrlsController(context);

            var res = await controller.Delete(123);
            Assert.IsType<NotFoundResult>(res);
        }
    }
}