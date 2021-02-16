JIRA: https://jira.lsstcorp.org/browse/<ID>

## What this change does ##

A few sentences describing the purpose of the change (“fix the page
reload bug”) and how you tackled it (“added a flag to prevent
reloading except when the moon is full”).

## Notes for reviewers ##

Anything you'd like reviewers to pay particular attention to or questions you have about the change.

Also try including an indication of how detailed a review you want on a 1-10 scale.
- 1 = "I barely need review on this"
- 5 = "Please make sure there are no obvious errors and that you believe it does what it is supposed to do"
- 10 = "I need you to understand this almost as well as I understand it, let's set aside some time to talk about it in detail"

## Testing ##

Describe how this change has been tested. If you wrote new tests in
the change it's fine to just put "New tests in PR". If you haven't
added any tests but you think your change is covered by existing tests
you can say "Existing tests". And if you're not sure the change is
sufficiently well tested but you're not sure how to test it, say that.

## Checklist ##

If any of the following are true, please check them off, and add the related label to this PR
- [ ] This is a breaking change and I will notify Product Marketing when it is in prod and user visible.
- [ ] This is a user-visible non-breaking change and I will notify Product Marketing when it is in prod and user visible.
- [ ] This is a user-visible change. Metadata has been updated to reflect the change.
- [ ] This requires an infrastructure deploy. I will deploy to staging after this PR is approved but before merging. The person merging to main will deploy infra to production.
- [ ] This adds a new organization or changes a table schema and should not be deployed while dags are running. (Just adding and removing committees from an org is fine)
