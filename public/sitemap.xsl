<?xml version="1.0" encoding="UTF-8"?>
<!--
  Presentation only. Browsers apply this when a person opens sitemap.xml;
  crawlers ignore the xml-stylesheet instruction entirely and read the raw XML.
-->
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap | nicklasvedeby.com</title>
        <style>
          :root {
            color-scheme: dark;
          }

          body {
            margin: 0;
            padding: 2.5rem 1.5rem 4rem;
            background: #0b1120;
            color: #cbd5e1;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 15px;
            line-height: 1.6;
          }

          .wrap {
            max-width: 1000px;
            margin: 0 auto;
          }

          .eyebrow {
            margin: 0 0 0.4rem;
            color: #22d3ee;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0 0 0.75rem;
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            background: linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .lead {
            margin: 0 0 2rem;
            max-width: 60ch;
            color: #94a3b8;
          }

          .count {
            display: inline-block;
            margin-bottom: 2rem;
            padding: 0.35rem 0.9rem;
            border: 1px solid rgba(139, 92, 246, 0.4);
            border-radius: 999px;
            color: #a78bfa;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 0.8rem;
          }

          .table-scroll {
            overflow-x: auto;
            border: 1px solid rgba(139, 92, 246, 0.25);
            border-radius: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.92rem;
          }

          th {
            padding: 0.85rem 1rem;
            background: #111c33;
            color: #94a3b8;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            text-align: left;
            white-space: nowrap;
          }

          td {
            padding: 0.8rem 1rem;
            border-top: 1px solid rgba(148, 163, 184, 0.12);
            vertical-align: top;
          }

          tr:hover td {
            background: rgba(139, 92, 246, 0.07);
          }

          a {
            color: #67e8f9;
            text-decoration: none;
            word-break: break-word;
          }

          a:hover {
            color: #a78bfa;
            text-decoration: underline;
          }

          .lang {
            display: inline-block;
            margin: 0 0.3rem 0.3rem 0;
            padding: 0.1rem 0.5rem;
            border-radius: 5px;
            background: rgba(34, 211, 238, 0.12);
            color: #67e8f9;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 0.72rem;
            text-transform: uppercase;
          }

          .muted {
            color: #7c8aa0;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 0.82rem;
            white-space: nowrap;
          }

          footer {
            margin-top: 2rem;
            color: #64748b;
            font-size: 0.85rem;
          }
        </style>
      </head>

      <body>
        <div class="wrap">
          <p class="eyebrow">XML Sitemap</p>
          <h1>nicklasvedeby.com</h1>
          <p class="lead">
            This is the machine readable list of pages on this site, one entry per
            language. Search engines read the raw XML; this styled view is only here
            so it is legible when a person opens it.
          </p>

          <p class="count">
            <xsl:value-of select="count(s:urlset/s:url)"/>
            <xsl:text> URLs</xsl:text>
          </p>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Languages</th>
                  <th>Last modified</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td>
                      <a href="{s:loc}">
                        <xsl:value-of select="s:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:for-each select="xhtml:link[@rel='alternate']">
                        <span class="lang">
                          <xsl:value-of select="@hreflang"/>
                        </span>
                      </xsl:for-each>
                    </td>
                    <td class="muted">
                      <xsl:value-of select="s:lastmod"/>
                    </td>
                    <td class="muted">
                      <xsl:value-of select="s:priority"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Generated for nicklasvedeby.com. Raw XML is what crawlers consume.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
