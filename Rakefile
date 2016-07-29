post_source_dir      = "src/content/posts"      # post directory
project_source_dir   = "src/content/projects"   # project directory
new_post_ext    = "md"

# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in #{post_source_dir}"
task :new_post, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end

  filename = "#{post_source_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.downcase.gsub(" ", "-")}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post.html"
    post.puts "title: #{title.gsub(/&/,'&amp;')}"
    post.puts "author: Jake Lear"
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
    post.puts "draft: true"
    post.puts "---"
  end
end

# usage rake new_project[my-new-project] or rake new_project['my new project'] or rake new_project (defaults to "new-project")
desc "Begin a new project in #{project_source_dir}"
task :new_project, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a name for your project: ")
  end

  filename = "#{project_source_dir}/#{title.downcase.gsub(" ", "-")}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: project.html"
    post.puts "title: #{title.gsub(/&/,'&amp;')}"
    post.puts "author: Jake Lear"
    post.puts "date: #{Time.now.strftime('%Y-%m-%d %H:%M:%S %z')}"
    post.puts "draft: true"
    post.puts "---"
  end
end


def get_stdin(message)
  print message
  STDIN.gets.chomp
end
