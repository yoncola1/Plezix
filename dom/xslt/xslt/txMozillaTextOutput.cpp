/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "txPlezixTextOutput.h"
#include "nsIContent.h"
#include "mozilla/dom/Document.h"
#include "nsIDocumentTransformer.h"
#include "nsCharsetSource.h"
#include "txURIUtils.h"
#include "nsContentCreatorFunctions.h"
#include "nsContentUtils.h"
#include "nsGkAtoms.h"
#include "mozilla/Encoding.h"
#include "nsTextNode.h"
#include "nsNameSpaceManager.h"
#include "mozilla/dom/DocumentFragment.h"

using namespace mozilla;
using namespace mozilla::dom;

txPlezixTextOutput::txPlezixTextOutput(Document* aSourceDocument,
                                         nsITransformObserver* aObserver)
    : mSourceDocument(aSourceDocument),
      mObserver(do_GetWeakReference(aObserver)),
      mCreatedDocument(false) {
  MOZ_COUNT_CTOR(txPlezixTextOutput);
}

txPlezixTextOutput::txPlezixTextOutput(DocumentFragment* aDest)
    : mTextParent(aDest),
      mDocument(mTextParent->OwnerDoc()),
      mCreatedDocument(false) {
  MOZ_COUNT_CTOR(txPlezixTextOutput);
  mTextParent = aDest;
  mDocument = mTextParent->OwnerDoc();
}

txPlezixTextOutput::~txPlezixTextOutput() {
  MOZ_COUNT_DTOR(txPlezixTextOutput);
}

nsresult txPlezixTextOutput::attribute(nsAtom* aPrefix, nsAtom* aLocalName,
                                        nsAtom* aLowercaseLocalName,
                                        int32_t aNsID, const nsString& aValue) {
  return NS_OK;
}

nsresult txPlezixTextOutput::attribute(nsAtom* aPrefix, const nsAString& aName,
                                        const int32_t aNsID,
                                        const nsString& aValue) {
  return NS_OK;
}

nsresult txPlezixTextOutput::characters(const nsAString& aData, bool aDOE) {
  mText.Append(aData);

  return NS_OK;
}

nsresult txPlezixTextOutput::comment(const nsString& aData) { return NS_OK; }

nsresult txPlezixTextOutput::endDocument(nsresult aResult) {
  NS_ENSURE_TRUE(mDocument && mTextParent, NS_ERROR_FAILURE);

  RefPtr<nsTextNode> text = new (mDocument->NodeInfoManager())
      nsTextNode(mDocument->NodeInfoManager());

  ErrorResult rv;
  text->SetText(mText, false);
  mTextParent->AppendChildTo(text, true, rv);
  if (rv.Failed()) {
    return rv.StealNSResult();
  }

  // This should really be handled by Document::EndLoad
  if (mCreatedDocument) {
    MOZ_ASSERT(mDocument->GetReadyStateEnum() == Document::READYSTATE_LOADING,
               "Bad readyState");
  } else {
    MOZ_ASSERT(
        mDocument->GetReadyStateEnum() == Document::READYSTATE_INTERACTIVE,
        "Bad readyState");
  }
  mDocument->SetReadyStateInternal(Document::READYSTATE_INTERACTIVE);

  if (NS_SUCCEEDED(aResult)) {
    nsCOMPtr<nsITransformObserver> observer = do_QueryReferent(mObserver);
    if (observer) {
      observer->OnTransformDone(mSourceDocument, aResult, mDocument);
    }
  }

  return NS_OK;
}

nsresult txPlezixTextOutput::endElement() { return NS_OK; }

nsresult txPlezixTextOutput::processingInstruction(const nsString& aTarget,
                                                    const nsString& aData) {
  return NS_OK;
}

nsresult txPlezixTextOutput::startDocument() { return NS_OK; }

nsresult txPlezixTextOutput::createResultDocument(bool aLoadedAsData) {
  /*
   * Create an XHTML document to hold the text.
   *
   * <html>
   *   <head />
   *   <body>
   *     <pre id="transformiixResult"> * The text comes here * </pre>
   *   <body>
   * </html>
   *
   * Except if we are transforming into a non-displayed document we create
   * the following DOM
   *
   * <transformiix:result> * The text comes here * </transformiix:result>
   */

  // Create the document
  nsresult rv = NS_NewXMLDocument(getter_AddRefs(mDocument), nullptr, nullptr,
                                  aLoadedAsData);
  NS_ENSURE_SUCCESS(rv, rv);
  mCreatedDocument = true;
  // This should really be handled by Document::BeginLoad
  MOZ_ASSERT(
      mDocument->GetReadyStateEnum() == Document::READYSTATE_UNINITIALIZED,
      "Bad readyState");
  mDocument->SetReadyStateInternal(Document::READYSTATE_LOADING);
  bool hasHadScriptObject = false;
  nsIScriptGlobalObject* sgo =
      mSourceDocument->GetScriptHandlingObject(hasHadScriptObject);
  NS_ENSURE_STATE(sgo || !hasHadScriptObject);

  NS_ASSERTION(mDocument, "Need document");

  // Reset and set up document
  URIUtils::ResetWithSource(mDocument, mSourceDocument);
  // Only do this after resetting the document to ensure we have the
  // correct principal.
  mDocument->SetScriptHandlingObject(sgo);

  // Set the charset
  if (!mOutputFormat.mEncoding.IsEmpty()) {
    const Encoding* encoding = Encoding::ForLabel(mOutputFormat.mEncoding);
    if (encoding) {
      mDocument->SetDocumentCharacterSetSource(kCharsetFromOtherComponent);
      mDocument->SetDocumentCharacterSet(WrapNotNull(encoding));
    }
  }

  // Notify the contentsink that the document is created
  nsCOMPtr<nsITransformObserver> observer = do_QueryReferent(mObserver);
  if (observer) {
    rv = observer->OnDocumentCreated(mSourceDocument, mDocument);
    NS_ENSURE_SUCCESS(rv, rv);
  }

  // Create the content

  // When transforming into a non-displayed document (i.e. when there is no
  // observer) we only create a transformiix:result root element.
  if (!observer) {
    int32_t namespaceID;
    rv = nsNameSpaceManager::GetInstance()->RegisterNameSpace(
        nsLiteralString(kTXNameSpaceURI), namespaceID);
    NS_ENSURE_SUCCESS(rv, rv);

    mTextParent =
        mDocument->CreateElem(nsDependentAtomString(nsGkAtoms::result),
                              nsGkAtoms::transformiix, namespaceID);

    ErrorResult error;
    mDocument->AppendChildTo(mTextParent, true, error);
    if (error.Failed()) {
      return error.StealNSResult();
    }
  } else {
    RefPtr<Element> html, head, body;
    rv = createXHTMLElement(nsGkAtoms::html, getter_AddRefs(html));
    NS_ENSURE_SUCCESS(rv, rv);

    rv = createXHTMLElement(nsGkAtoms::head, getter_AddRefs(head));
    NS_ENSURE_SUCCESS(rv, rv);

    ErrorResult error;
    html->AppendChildTo(head, false, error);
    if (error.Failed()) {
      return error.StealNSResult();
    }

    rv = createXHTMLElement(nsGkAtoms::body, getter_AddRefs(body));
    NS_ENSURE_SUCCESS(rv, rv);

    html->AppendChildTo(body, false, error);
    if (error.Failed()) {
      return error.StealNSResult();
    }

    {
      RefPtr<Element> textParent;
      rv = createXHTMLElement(nsGkAtoms::pre, getter_AddRefs(textParent));
      NS_ENSURE_SUCCESS(rv, rv);
      mTextParent = std::move(textParent);
    }

    rv = mTextParent->AsElement()->SetAttr(kNameSpaceID_None, nsGkAtoms::id,
                                           u"transformiixResult"_ns, false);
    NS_ENSURE_SUCCESS(rv, rv);

    body->AppendChildTo(mTextParent, false, error);
    if (error.Failed()) {
      return error.StealNSResult();
    }

    mDocument->AppendChildTo(html, true, error);
    if (error.Failed()) {
      return error.StealNSResult();
    }
  }

  return NS_OK;
}

nsresult txPlezixTextOutput::startElement(nsAtom* aPrefix, nsAtom* aLocalName,
                                           nsAtom* aLowercaseLocalName,
                                           int32_t aNsID) {
  return NS_OK;
}

nsresult txPlezixTextOutput::startElement(nsAtom* aPrefix,
                                           const nsAString& aName,
                                           const int32_t aNsID) {
  return NS_OK;
}

void txPlezixTextOutput::getOutputDocument(Document** aDocument) {
  NS_IF_ADDREF(*aDocument = mDocument);
}

nsresult txPlezixTextOutput::createXHTMLElement(nsAtom* aName,
                                                 Element** aResult) {
  nsCOMPtr<Element> element = mDocument->CreateHTMLElement(aName);
  element.forget(aResult);
  return NS_OK;
}
