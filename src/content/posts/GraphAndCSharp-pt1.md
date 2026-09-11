---
title: "Using C# with Graph API - Part 1 - C# super basics"
date: 2023-05-08
lastModified: 2023-05-08
author: Scott McAllister
tags:
  - "C#"
  - CSharp
  - VSCode
  - Visual Studio Code
  - Development
  - Programming
  - Microsoft Graph
  - Graph API
draft: false
---

## Working with C#

This post is one in a series about using Graph API with C#, It's broken down into the following parts

- **Part 1: Getting started with C# and VScode (You Are Here)**  
- [Part 2.1: Getting started with Authentication - Client credential flow](https://scotscottmca.com/posts/graphandcsharp-pt2-1-authentication/)  
- Part 2.2: Getting started with Authentication - Interactive authentication  
- Part 3: Types of Graph calls  
- Part 4: User management  
- Part 5: Applications  
- Part 6: Interacting with devices  
- Part 7: 429 Too Many Requests  

Over the last 12 months, I've thrown myself into the deep end of learning C#, and part of that rabbit hole has been working with Microsoft's Graph API. 

I see many examples of using PowerShell & Graph API, but C# doesn't get as much love, so I figured I'd share some of what I'd learned with you all. I will do my best to keep everything as high level as possible while ensuring everything is reproducible by you!


This series aims to provide a basic introduction and, hopefully, an understanding of C# and Graph API. 

### Requirements
1. [Visual Studio Code](https://code.visualstudio.com/)
2. [.NET Core SDK](https://dotnet.microsoft.com/en-us/download/dotnet/sdk-for-vs-code)
3. [C# Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

## Getting Started with C# and VSCode

Before doing anything, we must create a project and install the C# extension. 

### New Folder

I recommend keeping a location on your device that isn't synced to OneDrive just for your code because it should all be stored in GitHub anyway, right? I've created a folder called GraphAndCSharp, with a subfolder called ScotScottMcA, so let's open GraphAndCSharp in VScode and navigate to our subfolder. 

![New Folder](../../assets/images/GraphAndCSharp/1NewFolder.png)

![Open Folder](../../assets/images/GraphAndCSharp/2OpenFolder.png)

![CD Folder](../../assets/images/GraphAndCSharp/4CDFolder.png)

### CSharp Extension

The most important thing is the C# extension for VSCode; we can install this easily. Select the extensions icon on the left, search for C#, and it should be the first one in your list. Click, Install.

![CSharp extension](../../assets/images/GraphAndCSharp/3CSharpextension.png)

### New project

We can use dotnet templates to spin up everything we need for a new project quickly, so let's do that!

**dotnet new console** will give us all the prerequisites for a dotnet console application, e.g., our project file, target framework settings & debug path.

![dotnet new console](../../assets/images/GraphAndCSharp/5dotnetnewconsole.png)

### Restart VSCode

To finish creating our project, we want to restart VSCode so that it detects the new project file. Once restarted, VSCode will prompt you to add missing build and debug assets to our project; select Yes. 

![restart vscode](../../assets/images/GraphAndCSharp/6restartvscode.png)

### The project 

We can now see all the files and folders of our new project, all created automatically for us. Let's focus primarily on Program.cs for now.

![project folder](../../assets/images/GraphAndCSharp/7projectfolder.png)

In Program.cs, we'll see that the dotnet template has given us a super simple "Hello, World" app, which we can run by pressing F5 and view the output in our debug console. 

![Hello world](../../assets/images/GraphAndCSharp/8Helloworld.png)

![Hello world](../../assets/images/GraphAndCSharp/8-1Helloworld.png)

-----

## Part 2.1

In part 2.1 we will set up our project to query a Graph API endpoint. 
[Click here for part 2](https://scotscottmca.com/posts/graphandcsharp-pt2-1-authentication/)

Thanks for reading :)

-----

Want to see something else added? <a href="https://github.com/smcallister594/scotscottmca/issues/new">Open an issue.</a>