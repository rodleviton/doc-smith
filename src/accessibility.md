---
layout: layout-default.hbs
collection: pages
title: Accessibility
priority: 4
---


#### Page Headings
Modules that do not have full control of the html document cannot manipulate the `<title></title>` tag attribute.
The main heading *(H1)* within these modules should have the attribute `tabindex="-1"` added to ensure it is announced on page transition.

### Labels
Some field labels require enhanced descriptions to allow for better screen readability. To achieve this we can update the language definition file for labels to include screen reader only text.

```js
{
  SELECT_ACCOUNT: 'Select <span class="sr-only">for</span> account'
}
```

```html
<div class="form-group-horizontal form-group-md form-group">
  <label class="control-label" for="accountFrom" translate="{{'LABEL.SELECT_ACCOUNT'}}"></label>
  <div class="control-row">
    <select id="accountFrom" name="accountFrom" ng-model="ft.data.accountFrom" ng-options="item.label for item in ft.mockData.accounts track by item.label" class="form-control">
      <option value="">{{'PLACEHOLDER.SELECT' | translate}}</option>
    </select>
  </div>
</div>
```

### Abbreviations
Labels and body copy that has been abvbreviated should use the html `<abbr></abbr>` attribute to provide further information to users and screen readers.

```html
<abbr title="Number">No.</abbr>
```

### Dynamic Content
Some dynamically added content may need to be announced via a screen reader. For example loaders and inline alert messages. The suggested pattern for doing this is to add the `aria-live="polite"`. This will enable screen readers to announce the dynamically added content.

**note**
Only one aria-live region should be present at any one time.

e.g.

```html
<span ng-if="$ctrl.states.verificationInProgress" aria-live="polite">
  <img src="img/loading.svg" alt="Loading in progress" />
  Checking
</span>
```

## Resources

[General Accessibility Requirements]('/assets/docs/general-accessibility-requirements.docx)

[Accessibility Developement Guidelines]('/assets/docs/Accessibility-DEV-Requirements.docx)
