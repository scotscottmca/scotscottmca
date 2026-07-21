---
title: "Using C# with Graph API - Part 2.1 - Authentication - The client credential flow"
date: 2023-05-19
lastModified: 2023-05-19
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

## The client credential flow

This post is one in a series about using Graph API with C#, It's broken down into the following parts

- [Part 1: Getting started with C# and VScode](https://scotscottmca.com/posts/GraphAndCSharp-pt1/)  
- **Part 2.1: Getting started with Authentication - Client credential flow (You Are Here)**  
- Part 2.2: Getting started with Authentication - Interactive authentication  
- Part 3: Types of Graph calls  
- Part 4: User management  
- Part 5: Applications  
- Part 6: Interacting with devices  
- Part 7: 429 Too Many Requests  


In this post, and Part 2.2, we'll look at 2 methods of authenticating with Graph API using our app from part 1 as a foundation.

Authentication is a dark art in my opion, and it can definitely get wild. A great resource for understanding the authentication methods we're going to look at comes from the [Intune Training team](https://www.youtube.com/watch?v=yW39sbwunDQ).

The first method we'll look at is using the client credential flow and API permissions we configured. This can be the simpler approach to authentication, as your authentication credentials are stored in code and you don't need to interact with it all. Storing credentials in code is not something I would recommend. In 2.2 we'll look at how to authenticate without storing credentials in code. 

The client credential flow enables applications to run without user interaction, using its own credentials, instead of impersonating another user. 

[Client credential flow documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow)


### Requirements

In addition to the requirements from [Pt.1](https://scotscottmca.com/2023/05/08/GraphAndCSharp-pt1/)

1. [Microsoft Graph Beta SDK](https://www.nuget.org/packages/Microsoft.Graph.Beta/5.29.0-preview)
2. [Azure Indentity SDK](https://www.nuget.org/packages/Azure.Identity)
3. [Azure App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

### What is **Graph API**?

Microsofts Graph API is a RESTful web API, providing a unified endpoint for accessing data across all of the Microsoft 365 services. With it, developers can build applications that interact with M365 services, allowing them to retrieve and manipulate data without leaving their application. 

Full documentation for Graph API can be found here - [Graph API documentation](https://learn.microsoft.com/en-us/graph/use-the-api)

### What is an **Azure App Registration**?

An Azure App Registration is an identity for your application, which can be used to authenticate and authorize users and services to access Azure resources

### Configuration our requirements

Installing our requirements is super simple! So lets just reuse our existing Hello World project and in our Terminal run the following 2 commands. 

{% highlight csharp %}
// Install required nuget packages
dotnet add package Microsoft.Graph.Beta --prerelease
dotnet add package Azure.Identity
{% endhighlight %}

Once done, we'll be able to build some functions to query the API. But before we get too ahead of ourselves, we need an Azure App Registration. 

Let's create one in under 60 seconds

![App Registration](/images/GraphAndCSharpPt2/AppRegistration.gif)

In this gif we do the following:

- Create a new app registration
- Give it a name
- Remove the default User.Read permission
- Add the Device.Read.All permission
- Grant consent for that permission change
- Create a client secret for authentication

Make sure you copy the client secret and keep it safe!

The API permissions we added are specific to the graph call we will run later in this post. Different calls will require different permissions, and we'll talk about how to determine what is required in a later post.

### Using client credential flow

Firstly, Lets add our Tenant Id, Client Id (Application Id) and Client Secret. To get this, click on the Overview of the App Registartion we created. 

![App Tenant IDs](/images/GraphAndCSharpPt2/AppTenantIDs.png)

```csharp
#region Tenant ID, Client ID & Client Secret
// Tenant ID for your Azure AD App Registration
var tenantId = "3fbfeed3-ce73-41ed-8668-59bed6836184";
// clientId from app registration
var clientId = "0029a3cb-4a33-45da-8d1d-bceaa5723cd6";
// Client Secret from app registration
var clientSecret = "********";
#endregion
```

Next, Let's create a method to connect to our app registration, query [Graph API's beta Devices endpoint](https://learn.microsoft.com/en-us/graph/api/device-list?view=graph-rest-1.0&tabs=http) and get all devices in our tenant.

We won't go into this method in extensive detail, however I have commented it and will share relevant docs on everything used at the end of this post. 

```csharp
#region Using ClientSecret for authentication
// ListDevicesAsyncUsingClientSecret will take a Tenant ID, Client ID, 
// and Client Secret to authenticate and list all devices in the tenant
async Task ListDevicesAsyncUsingClientSecret(string clientId, string clientSecret, string tenantId)
{
    // Because we have already configured the required permissions for the app registration, 
    // we can use the .default scope
    var scopes = new[] { "https://graph.microsoft.com/.default" };

    // We are using AzurePublicCloud, so we need to define the AuthorityHost
    var options = new TokenCredentialOptions
    {
        AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
    };

    // Pass in our Tenant ID, Client ID, and Client Secret to create a ClientSecretCredential
    var clientSecretCredential = new ClientSecretCredential(
        tenantId, clientId, clientSecret, options);

    // Create a GraphServiceClient with the ClientSecretCredential and Scopes, 
    //which can be used to query the Graph API
    var graphClient = new GraphServiceClient(clientSecretCredential, scopes);

    try
    {
        // List all devices in the tenant using the Devices endpoint of Graph API Beta 
        var result = await graphClient.Devices.GetAsync();
        foreach (var item in result.Value)
        {
            Console.WriteLine("-----------------");
            Console.WriteLine(item.DisplayName);
        }
        Console.WriteLine("-----------------");
    }
    // Catch any errors that may occur instead of dumping them into the nether
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred: {ex.Message}");
    }
}
#endregion
```


### Doing the thing

So let's run this, by pressing F5. 
We can watch our app build, run, and then write out the names of the devices in our test tenant.

![Running Our App](/images/GraphAndCSharpPt2/RunningOurApp.gif)


-----

## Part 2.2

In Part 2.2 we'll look at authenticating using [interactive authentication](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet).

Thanks for reading :)

-----
### Resources

[TokenCredentialOptions Class](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.tokencredentialoptions?view=azure-dotnet)

[AzureAuthorityHosts Class](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.azureauthorityhosts?view=azure-dotnet)

[ClientSecretCredential Class](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.clientsecretcredential?view=azure-dotnet)

[GraphServiceClient](https://learn.microsoft.com/en-us/graph/sdks/create-client?tabs=CS)

[Exception Handling](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/exception-handling)

[Try Catch](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/exception-handling-statements#the-try-catch-statement)

[var](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/declarations)