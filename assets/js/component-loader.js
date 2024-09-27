function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ComponentLoader = {
    loadComponent: function(componentName, ...params) {
        const componentPath = `./components/${componentName}`;

        // Load the component's HTML
        fetch(`${componentPath}/index.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${componentName}`);
                }
                return response.text();
            })
            .then(htmlContent => {
                let finalHtml = htmlContent;

                // Replace placeholders with the provided params
                params.forEach((param, index) => {
                    const placeholder = `{{param${index + 1}}}`;
                    finalHtml = finalHtml.replace(new RegExp(placeholder, 'g'), ComponentLoader.resolveParam(param));
                });

                // Inject the final HTML into the correct location
                ComponentLoader.injectHTML(componentName, params, finalHtml);

                // Load, execute the component's JS, and apply the component's CSS
                ComponentLoader.loadAndExecuteComponentScripts(componentName);

                // After insertion, check for any nested components in the newly inserted HTML
                ComponentLoader.loadComponents(document.body);
            })
            .catch(error => {
                // Handle error by displaying an error message in place of the component
                ComponentLoader.replacePlaceholderWithError(componentName, params, error.message);
            });
    },

    injectHTML: function(componentName, params, finalHtml) {
        // Traverse text nodes to find the correct placeholder and replace it
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const nodeValue = node.nodeValue.trim();
            const regex = new RegExp(`\\{\\{${componentName}\\[(.*?)\\]\\}\\}`);
            if (regex.test(nodeValue)) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = finalHtml;
                while (tempDiv.firstChild) {
                    node.parentNode.insertBefore(tempDiv.firstChild, node);
                }
                node.parentNode.removeChild(node);

                // Recursively process any newly inserted content for nested components
                ComponentLoader.loadComponents(tempDiv);
                break;
            }
        }
    },

    loadAndExecuteComponentScripts: function(componentName) {
        const componentPath = `./components/${componentName}`;

        // Load the component's CSS
        if (!document.querySelector(`link[href="${componentPath}/style.css"]`)) {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = `${componentPath}/style.css`;
            document.head.appendChild(cssLink);
        }

        // Load and execute the component's JS
        fetch(`${componentPath}/script.js`)
            .then(response => response.text())
            .then(scriptContent => {
                const scriptTag = document.createElement('script');
                scriptTag.textContent = scriptContent;
                document.body.appendChild(scriptTag);
            })
            .catch(error => {
                console.error(`Error loading script for ${componentName}:`, error);
            });
    },

    replacePlaceholderWithError: function(componentName, params, errorMessage) {
        // Traverse text nodes to find the correct placeholder and replace it with an error message
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const nodeValue = node.nodeValue.trim();
            const regex = new RegExp(`\\{\\{${componentName}\\[(.*?)\\]\\}\\}`);
            if (regex.test(nodeValue)) {
                node.nodeValue = `Error: ${errorMessage}`;
                break;
            }
        }
    },

    loadComponents: async function(container = document.body) {
        // This function scans the DOM for any component placeholders and loads them
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            await sleep(0);
            const content = node.nodeValue.trim();
            const regex = /\{\{([a-zA-Z0-9_-]+)\[(.*?)\]\}\}/;
            const match = content.match(regex);
            if (match) {
                const componentName = match[1];
                const rawParams = match[2].split(',').map(param => param.trim());
                const params = rawParams.map(param => {
                    if (param.startsWith('"') && param.endsWith('"')) {
                        return param.slice(1, -1); // Remove the quotes for strings
                    } else {
                        return eval(param); // Treat as variable
                    }
                });
                ComponentLoader.loadComponent(componentName, ...params);
            } else if (content.match(/\{\{([a-zA-Z0-9_-]+)\}\}/)) {
                const componentName = content.match(/\{\{([a-zA-Z0-9_-]+)\}\}/)[1];
                ComponentLoader.loadComponent(componentName);
            }
        }
    },

    resolveParam: function(param) {
        // Handle parameters based on their type
        if (typeof param === 'string') {
            return param;
        } else {
            return param.toString();
        }
    },

    serializeParam: function(param) {
        // Handle serialization of different data types for proper placeholder replacement
        if (typeof param === 'string') {
            return param.replace(/"/g, '\\"');
        } else if (typeof param === 'object') {
            return JSON.stringify(param);
        } else {
            return param.toString();
        }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // Load all components once the DOM is ready
    ComponentLoader.loadComponents();
});
