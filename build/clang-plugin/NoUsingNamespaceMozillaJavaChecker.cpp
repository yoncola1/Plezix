/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "NoUsingNamespacePlezixJavaChecker.h"
#include "CustomMatchers.h"

void NoUsingNamespacePlezixJavaChecker::registerMatchers(
    MatchFinder *AstMatcher) {
  AstMatcher->addMatcher(
      usingDirectiveDecl(isUsingNamespacePlezixJava()).bind("directive"),
      this);
}

void NoUsingNamespacePlezixJavaChecker::check(
    const MatchFinder::MatchResult &Result) {
  const UsingDirectiveDecl *Directive =
      Result.Nodes.getNodeAs<UsingDirectiveDecl>("directive");
  const NamespaceDecl *Namespace = Directive->getNominatedNamespace();

  diag(Directive->getUsingLoc(), "using namespace %0 is forbidden",
       DiagnosticIDs::Error)
      << Namespace->getQualifiedNameAsString();
}
