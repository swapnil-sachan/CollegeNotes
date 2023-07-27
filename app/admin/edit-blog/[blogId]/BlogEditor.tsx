'use client';

import axios from 'axios';
import React, { useState } from 'react';
import Image from 'next/image';
import { RiDraftFill, RiImageAddFill } from 'react-icons/ri';
import { MdPublish } from 'react-icons/md';
import { toast } from 'react-hot-toast';

import OutlinedInput from '@/app/components/inputs/OutlinedInput';
import SolidButton from '@/app/components/buttons/SolidButton';
import OutlinedTextArea from '@/app/components/inputs/OutlinedTextArea';
import OutlineButton from '@/app/components/buttons/OutlineButton';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type ReactQuill from 'react-quill';
import { Blog, Category } from '@prisma/client';

const QuillNoSSRWrapper = dynamic (
  async () => {
    const { default: RQ } = await import('react-quill');

    // eslint-disable-next-line react/display-name
    return ({ ...props }) => <RQ {...props} />;
  }, { 
    ssr: false,
    loading: () => <p>Loading ...</p>
  }
) as typeof ReactQuill;

interface BlogEditorProps {
  categories: Category[];
  blog: Blog;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ categories, blog }) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { header: '3' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }

  const id = blog.blogId;
  
  const [title, setTitle] = useState(blog.title);
  const [blogId, setBlogId] = useState(blog.blogId);
  const [headline, setHeadline] = useState(blog.headline);
  const [summary, setSummary] = useState(blog.summary);
  const [metaDescription, setMetaDescription] = useState(blog.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(blog.metaKeywords);
  const [content, setContent] = useState(blog.content);
  const [categoryId, setCategoryId] = useState(blog.categoryId);
  const [categoryName, setCategoryName] = useState(blog.categoryName);
  const [poster, setPoster] = useState<File>();
  const [posterPrev, setPosterPrev] = useState(blog.poster.url);

  const submitHandler = async (event: any) => {
    event.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("blogId", blogId);
    myForm.append("headline", headline);
    myForm.append("summary", summary);
    myForm.append("metaDescription", metaDescription);
    myForm.append("metaKeywords", metaKeywords);
    myForm.append("content", content);
    myForm.append("categoryId", categoryId);
    myForm.append("categoryName", categoryName);
    myForm.append("poster", poster!);

    const response = await axios.put(`/api/admin/blog/${id}`, myForm)
    .then(() => {
      toast.success("Blog updated successfully");
      window.location.href = "/admin/blogs";
    })
    .catch((error) => {
      toast.error("Some error occurred");
    });
  };

  const changePosterHandler = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPosterPrev(reader.result ? reader.result.toString() : "");
      setPoster(file);
    }
  }

  return (
    <div className='
      flex flex-row
      justify-around
      min-h-[125vh] sm:min-h-[95vh]
      w-full
    '>
      <div className='
        flex flex-col
        items-center
        h-full
        mx-3 my-10
        w-full md:w-[800px]
      '>
        <h1 className='text-4xl font-extrabold pb-8 text-center'>
          Edit Blog
        </h1>

        <form
          onSubmit={(e: any) => submitHandler(e)}
          className='flex flex-col gap-[12px] w-full'
        >
          <div className='flex flex-row gap-3'>
            <OutlinedInput
              placeholder='Blog Title'
              color='cyan'
              value={title}
              onChange={(value: string) => setTitle(value)}
              required
            />

            <input
              id={"poster-btn"}
              accept="image/png, image/jpg, image/jpeg"
              type={"file"}
              onChange={changePosterHandler}
              className='hidden'
            />

            <SolidButton
              color='cyan'
              leftIcon={RiImageAddFill}
            >
              <label htmlFor='poster-btn' className='cursor-pointer font-medium'> Poster </label>
            </SolidButton>
          </div>
          
          <OutlinedInput
            placeholder='Please enter a blog headline'
            color='cyan'
            value={headline}
            onChange={(value: string) => setHeadline(value)}
            required
          />

          <OutlinedTextArea
            placeholder='Please enter a blog summary'
            color='cyan'
            value={summary}
            onChange={(value: string) => setSummary(value)}
            required
          />

          <OutlinedTextArea
            placeholder='Please enter a SEO oriented blog desciption'
            color='cyan'
            value={metaDescription}
            onChange={(value: string) => setMetaDescription(value)}
            required
          />

          <div className='flex flex-col md:flex-row gap-3'>
            <OutlinedInput
              placeholder='SEO Keywords (comma separated)'
              color='cyan'
              value={metaKeywords}
              onChange={(value: string) => setMetaKeywords(value)}
              required
            />

            <OutlinedInput
              placeholder='Blog ID'
              color='cyan'
              value={blogId}
              onChange={(value: string) => setBlogId(value)}
              required
            />
          </div>

          <div className='flex flex-row flex-wrap gap-6 mt-2'>
            <h4 className='text-sm font-semibold'>
              Select a category:
            </h4>
            
            { categories && (
              categories.map((category: Category) => (
                <div className="flex items-center mb-4" key={category.id}>
                  <input
                    id={category.categoryId}
                    type="radio"
                    value={category.categoryId}
                    name="category"
                    className="w-4 h-4 dark:border-gray-300 dark:bg-slate-700"
                    onClick={() => {
                      setCategoryId(category.id);
                      setCategoryName(category.name);
                    }}
                  />

                  <label htmlFor={category.categoryId} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {category.name}
                  </label>
                </div>
              ))
            )}
          </div>

          { posterPrev && (
            <Image
              alt='Poster'
              src={posterPrev}
              width={900}
              height={900}
              className='rounded-lg mt-4'
            />
          )}

          <div className='
            flex flex-col
            items-center
            justify-between
            h-[1000px] md:h-[960px]
            w-full
            mt-10
          '>
            <div className='h-[850px] w-full'>
              <QuillNoSSRWrapper
                placeholder='Enter content of the blog here ...'
                modules={modules}
                value={content}
                onChange={setContent}
                theme='snow'
                style={{width: "100%", height: "100%"}}
              />
            </div>

            <div className='flex flex-row gap-3 w-full justify-end'>
              <OutlineButton
                color='cyan'
                label='Save Draft'
                leftIcon={RiDraftFill}
              />

              <SolidButton
                submit={true}
                color='cyan'
                label='Publish'
                leftIcon={MdPublish}
              />
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}

export default BlogEditor;