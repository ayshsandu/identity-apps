/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as translations from "./translations";
import { InitOptions, Resource } from "i18next";
import { I18nModuleConstants } from "./constants";
import { SupportedLanguagesMeta } from "./models";

/**
 * Generate the i18n options.
 *
 * @param {i18next.InitOptions} options - Options override.
 * @param {boolean} override - Should the passed in options replace the default.
 * @param {boolean} debug - Debug enabled flag.
 * @return {InitOptions} Init options config.
 */
export const generateI18nOptions = (options: InitOptions, override: boolean, debug: boolean): InitOptions => {

    const DEFAULT_INIT_OPTIONS: InitOptions = {
        contextSeparator: "_",
        debug: false,
        defaultNS: I18nModuleConstants.DEFAULT_NAMESPACE,
        fallbackLng: I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE,
        interpolation: {
            escapeValue: false
        },
        keySeparator: ".",
        ns: getNamespacesSupportedByDefault(),
        nsSeparator: ":",
        pluralSeparator: "_",
        resources: getResourcesSupportedByDefault()
    };

    if (override) {
        return {
            ...options,
            debug
        };
    }

    return {
        ...DEFAULT_INIT_OPTIONS,
        debug,
        ...options
    };
};

/**
 * Load the namespaces from the default bundle which is inside the module.
 *
 * @return {string[]} Namespace array.
 */
export const getNamespacesSupportedByDefault = (): string[] => {

    const namespaces: string[] = [];

    for (const value of Object.values(translations)) {
        for (const namespace of value.meta.namespaces) {
            if (!namespaces.includes(namespace)) {
                namespaces.push(namespace);
            }
        }
    }

    return namespaces;
};

/**
 * Load the default resource bundle available inside the module.
 *
 * @return {i18next.Resource} Resource bundle.
 */
export const getResourcesSupportedByDefault = (): Resource => {

    let resources: Resource = {};

    for (const locale of Object.values(translations)) {
        // Try to find the namespace resource file based on the namespaces array declared in meta.
        for(const resource of Object.values(locale.resources)) {
            resources = {
                ...resources,
                [ locale.meta.code ]: {
                    ...resources[ locale.meta.code ],
                    ...resource as object
                }
            };
        }
    }

    return resources;
};

/**
 * Get the supported list of languages that are supported by default.
 * i.e. The languages that are packed by default.
 *
 * @return {string[]} Supported languages.
 */
export const getLanguagesSupportedByDefault = (): string[] => {

    const languages: string[] = [];

    for (const value of Object.values(translations)) {
        languages.push(value.meta.code);
    }

    return languages;
};

/**
 * Checks if a passed in language is supported or not.
 *
 * @param {string} detectedLanguage - Detected language.
 * @param {string[]} supportedLanguages - Supported languages.
 * @param {SupportedLanguagesMeta} meta - Meta file.
 * @return {boolean} Returns true if supported, else returns false.
 */
export const isLanguageSupported = (detectedLanguage: string, supportedLanguages?: string[],
                                    meta?: SupportedLanguagesMeta): boolean => {

    let languages: string[] = getLanguagesSupportedByDefault();

    if (supportedLanguages && supportedLanguages instanceof Array && supportedLanguages.length > 0) {
        languages = supportedLanguages;
    } else if (meta) {
        languages = Object.keys(meta);
    }

    for (const lang of languages) {
        if (lang === detectedLanguage) {
            return true;
        }
    }

    return false;
};
