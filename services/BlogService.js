const fs = require('fs');

module.exports = {
    getBlogs: async () => {
        let blogs = [];

        fs.readdir('views/blogs', async (err, files) => {
            if (err) console.error(err)
          
            let blogPostFiles = files.filter(f => f.split('.').pop() === 'hbs');
          
            blogPostFiles.forEach(async (f, i) => {
              f = f.replace(".hbs", "");
              console.log(f);
              if (f === "blogIndex") return;

              let blogTitle = await module.exports.getBlogTitle(f);
              let blog = {
                  filename: f,
                  title: blogTitle
              }

              blogs.push(blog);
            });
        });
        
        return blogs;
    },

    getBlogTitle: async (filename) => {
        let title = filename.split('-').join(' ');
        return title;
    }
}