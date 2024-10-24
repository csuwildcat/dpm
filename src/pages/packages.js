import { LitElement, css, html, nothing, render } from 'lit';
import { Convert } from '@web5/common';

import { App } from '../app.js';
import * as protocols from '../utils/protocols.js';

import '../components/shoelace.js';

import '../components/create-identity.js';
import '../components/identity-selector.js';
import { notify } from '../utils/notifications.js';
import PageStyles from '../styles/page.js';

import { State, Query, Spinner, SpinnerStyles } from '../components/mixins/index.js';

const packageNameRegex = /^[a-zA-Z0-9\-]*/;
const supportedApps = {
  '^(?:.*)?github.com\\/([^\\/]+)\\/([^\\/]+)': {
    parser: match => {
      const owner = match[1];
      const repo = match[2];
      return `https://api.github.com/repos/${owner}/${repo}`;
    },
    handler: json => {
      const { name, description } = json;
      return { name, description };
    }
  }
};

export class PackagesPage extends LitElement.with(State, Query, Spinner) {

  static properties = {
    ready: { store: 'page' },
    identities: { store: 'page' },
    identityEndpointUpdate: { type: Object }
  }

  static query = {
    createPackageButton: '#create_package_button',
    createPackageModal: ['#create_package_modal', true],
    publishReleaseModal: ['#publish_release_modal', true],
    autoCreatePackageInput: ['#auto_create_package_input', true],
    manualCreatePackageName: ['#manual_create_package_name', true],
    identitySelector: '#create_package_identity_selector'
  }

  constructor() {
    super();
    this.profileProtocolEncoded = Convert.string(protocols.profile.uri).toBase64Url();
  }

  firstUpdated() {

    if (!this.ready.state) {
      this.startSpinner({ target: 'section', minimum: 500, renderImmediate: true });
    }
    this.ready.then(() => {
      this.stopSpinner();
    })
  }

  async createPackage() {

    const identity = this?.identities?.[this.identitySelector.value];
    if (!identity) {
      notify.error('You must select which identity you want to this new package to be published from.');
      return;
    }

    let app;
    let url;
    let data;
    let endpoint;
    try { url = new URL(this.autoCreatePackageInput.value) }
    catch (e) {}
    if (url) {
      for (let z in supportedApps) {
        const match = url.href.match(new RegExp(z))
        if (match){
          const result = supportedApps[z].parser(match);
          if (result) {
            app = supportedApps[z];
            endpoint = result;
            break;
          };
        }
      }
    }
    if (endpoint) {
      const json = await fetch(endpoint).then(res => res.json());
      data = app.handler(json);
      data.repo = url.href;
    }
    else if (this.manualCreatePackageName.value) {

    }
    else {
      notify.warning('You must enter at least a project link or package name to create a new package.');
      return;
    }
    if (!this?.packages?.find(record => record.tags.name === data.name)) {
      console.log(data);

    }
  }

  publishRelease() {

  }

  render() {
    const identities = Object.values(this.identities || {});
    const packages = Object.values(this.packages || {});
    return html`
      <section page-section>
        ${
          !identities?.length ? 
            html` <connect-widget></connect-widget>` : 
          !packages?.length ?
            html`
              <div id="placeholder" default-content="placeholder">
                <sl-icon name="box-seam"></sl-icon>
                <p>Looks like you don't have any packages, create your first one now.</p>
                <sl-button variant="success" @click="${ e => this.createPackageModal.show() }">Create a Package</sl-button>
              </div>
            ` : 
            html`
              <h2 flex>
                Packages
                <sl-button id="create_package_button" @click="${ e => this.createPackageModal.show() }">Create a Package</sl-button>
              </h2>
            `
        }
      </section>

      <sl-dialog id="create_package_modal" label="Create a Package" placement="start">

        <identity-selector id="create_package_identity_selector" label="Select an Publishing Identity"></identity-selector>

        <div divider></div>

        <sl-input id="auto_create_package_input" label="Add from project link" placeholder="Supported links: GitHub repos" @input="${ e => {
          this.createPackageModal.querySelectorAll('.manual-create-package-input').forEach(input => input.disabled = !!e.target.value);
        }}"></sl-input>

        <div divider>OR</div>

        <sl-input id="manual_create_package_name" class="manual-create-package-input" name="name" label="Name" help-text="Give your package a name" @input="${ e => {
          this.createPackageModal.querySelector('#auto_create_package_input').disabled = !!e.target.value;
        }}"></sl-input>
        <sl-textarea class="manual-create-package-input" name="description" label="Description" help-text="Add a description of what your package does" @input="${ e => {
          this.createPackageModal.querySelector('#auto_create_package_input').disabled = !!e.target.value;
        }}"></sl-textarea>

        <sl-button slot="footer" @click="${ e => this.createPackageModal.hide() }">Close</sl-button>
        <sl-button id="submit_endpoints_button" slot="footer" variant="success" @click="${ e => this.createPackage() }">Create</sl-button>
      </sl-dialog>

      <sl-dialog id="publish_release_modal" label="Publish a Release" placement="start">
          <sl-tab-group>

            <sl-tab slot="nav" panel="link">Add via link</sl-tab>
            <sl-tab slot="nav" panel="upload">Upload files</sl-tab>
            
            <sl-tab-panel name="link">

            </sl-tab-panel>

            <sl-tab-panel name="upload">

            </sl-tab-panel>

          </sl-tab-group>

        <sl-button slot="footer" @click="${ e => this.createPackageModal.hide() }">Close</sl-button>
        <sl-button id="submit_endpoints_button" slot="footer" variant="success" @click="${ e => this.createPackage() }">Publish</sl-button>
      </sl-dialog> 
    `
  }

  static styles = [
    PageStyles,
    SpinnerStyles,
    css`

      connect-widget {
        align-self: center;
      }

      #placeholder {
        text-align: center;
        
        & sl-icon {
          color: #777;
        }
        & sl-button {
          margin-top: 1rem;
        }
      }

      #create_package_button {
        margin-left: auto;
      }

    /* Modify Endpoints Dialog */

      #modify_endpoints_modal::part(panel) {
        max-width: 500px;
      }

      #modify_endpoints_identity sl-avatar {
        --size: 2.25rem;
        margin: 0 0.6rem 0 0;
      }

      #modify_endpoints_identity div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      #modify_endpoints_modal p {
        margin: 1rem 0 1.5rem;
        color: var(--sl-color-red-700);
      }

      @media(max-width: 800px) {

      }
    `
  ]
}

customElements.define('packages-page', PackagesPage)
