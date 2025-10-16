import React from 'react'
import ActionAreaCard from '@/components/studyDestinationComponents/studyDestinationCard'



const Blog = ({ blogs }) => {
  return (
    <div className="container mx-auto p-8 pb-16">
      <h1 className="text-h4TextPhone md:text-h4Text font-bold text-center mb-[2vw]">
        Blogs
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 md:max-w-[1312px] max-w-[616px] grid-flow-row justify-center mx-auto gap-[16px] md:gap-[16px] lg:gap-[24px] xl:gap-[32px]">
      {blogs.map((blog) => (
  <ActionAreaCard
    key={blog.id}
    href={`/blog/${blog.slug}`}
    image={blog.imageUrl || "/assets/Images/blogs/placeholder.webp"}
    title={blog.title.rendered}
    category="Blog"
    description={blog.acf.summary || "No description available"}
  />
))}
      </div>
    </div>
  )
}


export async function getServerSideProps(context) {
  const res = await fetch(
    `https://srv757671.hstgr.cloud/wp-json/wp/v2/blogs?_fields=id,slug,title,acf`
  )
  const blogs = await res.json()

  // Fetch image URLs for each blog using the ACF thumbnail ID
  const blogsWithImages = await Promise.all(
    blogs.map(async (blog) => {
      let imageUrl = null
      if (blog.acf?.thumbnail) {
        try {
          const imgRes = await fetch(
            `https://srv757671.hstgr.cloud/wp-json/wp/v2/media/${blog.acf.thumbnail}`
          )
          const imgData = await imgRes.json()
          imageUrl = imgData.source_url
        } catch (err) {
          console.error("Error fetching media:", err)
        }
      }
      return { ...blog, imageUrl }
    })
  )

  return {
    props: { blogs: blogsWithImages },
  }
}



export default Blog
