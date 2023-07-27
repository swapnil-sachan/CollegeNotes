import React from 'react';

import getBlogs from '@/app/actions/getBlogs';
import BlogsManager from './Blogs';
import { Blog } from '@prisma/client';

export const metadata = {
  title: 'Blogs Manager - CollegeNotes',
  description: 'View all blogs and related information on CollegeBlog. Edit or delete existing blogs.',
  keywords: 'collegenotes, collegenotes add subject, add subject to collegenotes, add subject',

  openGraph: {
    title: 'Blogs Manager - CollegeNotes',
    description: "View all blogs and related information on CollegeBlog. Edit or delete existing blogs.",
    url: 'https://www.collegenotes.co.in/admin/blogs',
  },

  twitter: {
    title: 'Blogs Manager - CollegeNotes',
    description: "View all blogs and related information on CollegeBlog. Edit or delete existing blogs."
  },
}

const Page = async () => {
  const blogs = await getBlogs();

  return (
    <BlogsManager blogs={blogs as Blog[]} />
  )
}

export default Page;