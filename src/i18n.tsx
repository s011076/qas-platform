import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import * as OpenCC from 'opencc-js';

export type Lang = 'zh-Hant' | 'zh-Hans';

// Converters (TW <-> CN)
const t2s = OpenCC.Converter({ from: 'tw', to: 'cn' });
const s2t = OpenCC.Converter({ from: 'cn', to: 'tw' });

const STORAGE_KEY = 'hk_qas_lang_v2';

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh-Hans' || saved === 'zh-Hant') return saved;
  } catch {
    // ignore
  }
  return 'zh-Hant';
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'zh-Hant',
  setLang: () => {},
});

export const useLang = () => useContext(LangContext);

/** Original-text snapshot cache: the React source is always Traditional, so we
 *  snapshot each text node the first time we see it and restore from the
 *  snapshot when switching back to Traditional — exact, no lossy s2t. */
const originalCache = new WeakMap<Text, string>();

/** Convert all visible text nodes under root (skips input values & placeholders). */
export function convertDomText(root: HTMLElement | null, lang: Lang) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }
  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent) return;
    const tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return;
    if (parent.isContentEditable) return;
    const raw = node.nodeValue || '';
    if (!raw.trim()) return;

    if (lang === 'zh-Hant') {
      // Restore exact original text from snapshot.
      const orig = originalCache.get(node);
      if (orig !== undefined) {
        if (node.nodeValue !== orig) {
          // If the current value is the simplified form of the snapshot, restore.
          // Otherwise React must have updated the text underneath — refresh snapshot.
          if (t2s(orig) === node.nodeValue) {
            node.nodeValue = orig;
          } else {
            originalCache.set(node, raw);
          }
        }
      } else {
        // Fresh node after React re-render — its current value IS the original.
        originalCache.set(node, raw);
      }
    } else {
      // Simplified: always convert from the snapshot original (idempotent & exact).
      let orig = originalCache.get(node);
      if (orig === undefined) {
        orig = raw;
        originalCache.set(node, raw);
      } else if (raw !== orig && t2s(orig) !== raw) {
        // React changed the text underneath — refresh the snapshot from current value.
        orig = raw;
        originalCache.set(node, raw);
      }
      const converted = t2s(orig);
      if (converted !== node.nodeValue) {
        node.nodeValue = converted;
      }
    }
  });
}

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

/** Hook: re-apply conversion after lang changes (both directions) and after React re-renders. */
export function useDomLangSync(ref: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  const { lang } = useLang();
  const prevLang = useRef(lang);

  useEffect(() => {
    const langChanged = prevLang.current !== lang;
    if (langChanged) {
      // Direction change: convert DOM both ways (t2s when switching to simplified,
      // s2t when switching back to traditional). s2t is best-effort for
      // already-converted text; source of truth is the React-rendered traditional.
      convertDomText(ref.current, lang);
      prevLang.current = lang;
    } else if (lang === 'zh-Hans') {
      // React re-rendered (tab/data change) and restored traditional source text —
      // re-apply simplified conversion.
      convertDomText(ref.current, lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, ...deps]);
}
