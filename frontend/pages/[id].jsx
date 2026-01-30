import React from 'react'
import Head from 'next/head'

const WORDPRESS_BASE = 'https://srv757671.hstgr.cloud/wp-json/wp/v2'
const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'blog',
  'blogs',
  'study-destination',
  'study-destinations',
  'contact',
  'contact-us',
  'about',
  'aboutUs',
  'login',
  'signup',
  'registered-student-login',
  'student-dashboard',
  'college-predictor',
  'counselor',
  'terms',
  'testimonial',
])

const BlogPageDetails = ({ page }) => {
  return (
    <div className='container  p-8 pb-16 pt-[20vw] md:pt-[7.25vw]'>
      <section className='mx-auto  max-w-[800px]'>
        <h1 className='text-h4TextPhone md:text-h4Text pb-[2vw] font-bold'>{page.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params
  const res = await fetch(
    `https://srv757671.hstgr.cloud/wp-json/wp/v2/posts?slug=${id}&_fields=id,slug,title,content`
  )
  const data = await res.json()
  const page = data[0] || null

  if (!page) {
    return { notFound: true }
  }

  return {
    props: { page },
  }
}


export default BlogPageDetails