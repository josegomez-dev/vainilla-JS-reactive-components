class ReactiveState {
    constructor() {
        this.state = {};
        this.bindings = {};

        // Proxy for the vars object to handle reactive properties
        this.vars = new Proxy(this.state, {
            get: (target, property) => {
                return target[property];
            },
            set: (target, property, value) => {
                target[property] = value;
                this.updateDOM(property);
                return true;
            }
        });
    }

    // Method to create a reactive variable and bind it to the DOM
    createReactive(key, initialValue, elementId = null, componentName = null) {
        this.vars[key] = initialValue;  // Define and set the initial value

        if (!this.bindings[key]) {
            this.bindings[key] = [];
        }

        if(elementId) {
            this.bindings[key].push(elementId);
            const e = document.getElementById(elementId);
            if (e) {
                e.innerText = this.vars[key];
            }
             // Bind to the DOM
        }
        // If a component name is provided, load its CSS and JS
        if (componentName) {
            this.loadComponentAssets(componentName);
        }
    }

    // Method to update the DOM when a reactive variable changes
    updateDOM(key) {
        if (this.bindings[key]) {
            this.bindings[key].forEach(elementId => {
                document.getElementById(elementId).innerText = this.vars[key];
            });
        }
    }

    // Method to load the CSS and JS for a component
    loadComponentAssets(componentName) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `./components/${componentName}/style.css`;
        document.head.appendChild(cssLink);

        const scriptTag = document.createElement('script');
        scriptTag.src = `./components/${componentName}/script.js`;
        document.body.appendChild(scriptTag);
    }
}

// Create a global instance of ReactiveState
const app = new ReactiveState();

