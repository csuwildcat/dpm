import { LitElement, css, html, nothing, render } from 'lit';
import { Convert } from '@web5/common';

import { App } from '../app.js';
import * as protocols from '../utils/protocols.js';

import '../components/shoelace.js';

import '../components/create-identity.js';
import '../components/detail-box.js';
import { notify } from '../utils/notifications.js';
import PageStyles from '../styles/page.js';

import { State, Query, Spinner, SpinnerStyles } from '../components/mixins/index.js';

export class PackagesPage extends LitElement.with(State, Query, Spinner) {

  static properties = {
    ready: { store: 'page' },
    identities: { store: 'page' },
    identityEndpointUpdate: { type: Object }
  }

  static query = {
    createPackageButton: '#create_package_button',
    createPackageModal: ['#create_package_modal', true]
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

  createPackage() {

    const packageData = { };

  }

  render() {
    const packages = Object.values(this.packages || {});

    return html`
      <section page-section>
        ${ !packages?.length ? 
          html`
            <connect-widget></connect-widget>
          ` : 
          html`
            <h2 flex>
              Packages


              <sl-button id="create_package_button" @click="${ async e => this.openPackageModal() }">Create a Package</sl-button>

            </h2>
          `
        }
      </section>

      <sl-dialog id="create_package_modal" label="Create a Package" placement="start" fit-content>
        
      </sl-dialog>

      <sl-dialog id="open_package_modal" label="Create a Package" placement="start">
        <sl-button slot="footer" @click="${ async e => this.openPackageModal.hide() }">Close</sl-button>
        <sl-button id="submit_endpoints_button" slot="footer" variant="success" @click="${ async e => this.createPackage() }">Create</sl-button>
      </sl-dialog>
    `
  }

  static styles = [
    PageStyles,
    SpinnerStyles,
    css`
      :host > section {
        
      }

      #identity_actions {
        margin-left: auto;
      }

      connect-widget {
        align-self: center;
      }

      #identity_list li {
        --border: 1px solid rgb(255 255 255 / 8%);
        list-style: none;
        border-bottom: var(--border);
      }

      #identity_list li:first-child {
        border-top: var(--border);
      } 

      #identity_list a {
        width: 100%;
        padding: 1.1rem 0 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
        color: var(--sl-color-blue-700);
        cursor: pointer;
      }

      #identity_list sl-avatar {
        --size: 2.25rem;
        margin: 0 0.5rem 0 0;
      }

      #identity_list [detail-box-toggle] {
        margin: 0 0 0 0.75rem;
      }

      #identity_list detail-box {
        max-height: 0;
      }

      #identity_list detail-box > :first-child {
        margin-bottom: 1rem;
        padding: 1.2rem 1.1rem;
        background: rgb(183 192 254 / 4%);
        border: 1px solid rgb(183 192 254 / 9%);
        border-radius: 5px;
      }

      #identity_list detail-box h3 {
        margin: 1.75rem 0 1rem;
        border-bottom: 1px solid rgba(255 255 255 / 8%);
        padding: 0 0 0.25rem;
      }

      #identity_list detail-box h3 :not(span) {
        margin: 0 0 0 auto;
      }

      #create_restore_buttons {
        margin: 2rem 0 0;
      }

      #create_restore_buttons sl-button {
        margin: 0 0.5rem;
      }

    /* Modify Endpoints Dialog */

      #modify_endpoints_modal::part(panel) {
        max-width: 500px;
      }

      .service-endpoint-entry:not(:last-child) {
        margin-bottom: 1rem;
      }

      .service-endpoint-input {
        flex: 1;
        margin: 0;
      }

      .service-endpoint-input ~ sl-button {
        margin: 0 0 0 0.5rem;
      }

      .service-endpoint-entry sl-icon {
        stroke: currentColor;
      }

      .service-endpoint-entry .remove-endpoint-button::part(base) {
        color: #ff2e2e;
      }

      .service-endpoint-entry .add-endpoint-button::part(base) {
        color: #00ba00;
      }

      .service-endpoint-entry:not(:last-child) .add-endpoint-button {
        visibility: hidden;
        pointer-events: none;
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
