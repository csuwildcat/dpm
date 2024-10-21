import { LitElement, css, html, nothing } from 'lit'
import { Convert } from '@web5/common';

import './shoelace.js';
import PageStyles from '../styles/page.js';

import { App } from '../app.js';
import { DOM } from '../utils/dom.js';
import { DWeb } from '../utils/dweb/index.js';
import { State, Query } from './mixins/index.js';

import * as protocols from '../utils/protocols.js';

export class IdentitySelector extends LitElement.with(State, Query) {

  static properties = {
    identities: { store: 'page' },
    label: { type: String },
    value: { type: String }
  }

  static query = {
    select: 'sl-select'
  }

  constructor(){
    super();
    this.profileProtocolEncoded = Convert.string(protocols.profile.uri).toBase64Url();
  }

  render() {
    const identities = Object.values(this.identities || {});
    console.log(this.value);
    return html`
      <sl-select label="${this.label || ''}" @sl-change="${ e => this.value = this.select.value }">
        ${ this.value ? html`<sl-avatar slot="prefix" image="${`https://dweb/${this.value}/read/protocols/${this.profileProtocolEncoded}/avatar`}" shape="circle" size="small"></sl-avatar>` : nothing }
        ${
          identities?.map(identity => html`
            <sl-option value="${identity.connectedDid}">
              <sl-avatar slot="prefix" image="${identity.avatar || `https://dweb/${identity.connectedDid}/read/protocols/${this.profileProtocolEncoded}/avatar`}" shape="circle" size="small"></sl-avatar>
              ${identity.connectedDid}
            </sl-option>
          `)
        }
      </sl-select>
    `
  }


  static styles = [
    PageStyles,
    css`
      #create_identity_button {
        display: block;
        margin: 1.5rem auto 0;
      }

      sl-select::part(combobox) {
        padding-left: 0.5rem;
      }

      sl-select > sl-avatar {
        --size: 1.5rem;
        margin: -0.2rem 0.4rem 0 0;
      }

      sl-option::part(label) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      sl-option > sl-avatar {
        --size: 1.75rem;
      }

    `
  ]
}

customElements.define('identity-selector', IdentitySelector)
