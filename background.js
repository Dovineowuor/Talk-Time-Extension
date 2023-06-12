(function () {
  'use strict';

  const apiUrl = "https://api.extension.uhat.io";
  let userOptions = {};

  const API = (userToken, cabinetIds) => {
    const makeRequest = async (path) => {
      const url = new URL(apiUrl + path);
      if (!userToken) return null;
      url.searchParams.set("userToken", userToken);
      url.searchParams.set("cabinetIds", cabinetIds);
      const response = await fetch(url.toString(), { method: "GET" }).catch(console.error);
      return response ? { data: response.status === 200 ? await response.json() : {} } : null;
    };

    return {
      getAccountAuthTokens: async (email) => makeRequest(`/account-tokens?email=${encodeURIComponent(email)}`),
      getAccounts: async () => makeRequest(`/accounts`),
      getCabinets: async () => makeRequest(`/cabinets`),
      getProfiles: async () => makeRequest(`/profiles`),
      getDialogs: async () => makeRequest(`/dialogs`),
      getPinnedDialogs: async () => makeRequest(`/dialogs/pinned`),
    };
  };

  async function deleteCookies(domain) {
    let count = 0;
    try {
      const cookies = await chrome.cookies.getAll({ domain: domain });
      if (cookies.length === 0) return "No cookies found";
      const removalPromises = cookies.map(removeCookie);
      await Promise.all(removalPromises);
      count = removalPromises.length;
    } catch (error) {
      return `Unexpected error: ${error.message}`;
    }
    return `Deleted ${count} cookie(s).`;
  }

  function removeCookie(cookie) {
    const url = `${cookie.secure ? "https:" : "http:"}//${cookie.domain}${cookie.path}`;
    return chrome.cookies.remove({ url: url, name: cookie.name, storeId: cookie.storeId });
  }

  // Open login.html for authentication
  chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({ url: "file:///home/dove/Freelance-Devs/TalkyTimesSoftware/assets/templates/login.html" });
  });

  // Message listener
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === "DO_ACCOUNT_AUTH") {
      // Uncomment the code below to enable authentication
      // const { getAccountAuthTokens } = API(request.userToken);
      // const {
      //   data: { accessToken, auth },
      // } = await getAccountAuthTokens(request.email);

      // await deleteCookies("talkytimes.com");

      // await chrome.cookies.set({
      //   url: "https://talkytimes.com/",
      //   domain: "talkytimes.com",
      //   expirationDate: Date.now() + 1000 * 60 * 60 * 24,
      //   name: "tld-token",
      //   path: "/",
      //   value: accessToken,
      // });

      // await chrome.cookies.set({
      //   url: "https://talkytimes.com/",
      //   domain: "talkytimes.com",
      //   expirationDate: Date.now() + 1000 * 60 * 60 * 24,
      //   name: "tu_auth",
      //   path: "/",
      //   value: JSON.stringify(auth),
      // });

      sendResponse({ success: true });
    }
  });

  // Extension settings
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "saveOptions") {
      // Save the options to chrome.storage
      chrome.storage.local.set({ talkytimesOptions: message.options }, function () {
        // Retrieve saved options from chrome.storage
        chrome.storage.local.get("talkytimesOptions", function (result) {
          userOptions = result.talkytimesOptions || {};

          // Update options on all available pages
          chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
              chrome.tabs.sendMessage(tab.id, { action: "useOptions", options: userOptions });
            });
          });
        });
      });

      // Close options.html
      chrome.tabs.query({ url: chrome.runtime.getURL("options.html") }, function (tabs) {
        if (tabs.length > 0) {
          chrome.tabs.remove(tabs[0].id);
        }
      });

      // Open popup.html in a new tab
      chrome.tabs.create({ url: "popup.html" });
    }
  });

  // Retrieve saved options from chrome.storage
  chrome.storage.local.get("talkytimesOptions", function (result) {
    userOptions = result.talkytimesOptions || {};
  });
})();

// Open login.html for authentication
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({ url: "file:///home/dove/Freelance-Devs/TalkyTimesSoftware/assets/templates/login.html" });
});

// Active user Management;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'activeUser') {
    // Get the active user data from the request
    const activeUser = request.data;

    // Process the active user data as needed
    // You can store it in local storage, send it to a server, etc.

    // use case: Log the active user data
    console.log('Active User:', activeUser);

    // Send a response back to the content script if needed
    sendResponse({ message: 'Active user data received' });
  }
});
