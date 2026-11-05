import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { variants, renderVariant } from './variants.mjs';

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(readFileSync(new URL('../public/reviews-data.js', import.meta.url), 'utf8'), context);
const reviews = context.window.IZMIR_REVIEWS;
const pages = [{ slug: '', html }, ...variants.map(variant => ({ slug: variant.slug, html: renderVariant(html, variant), variant }))];
const decode = text => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('every page references only files that exist', () => {
  for (const page of pages) {
    const paths = new Set([...page.html.matchAll(/\/assets\/[\w./-]+\.\w+/g)].map(match => match[0]));
    assert.ok(paths.size > 10);
    for (const path of paths) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `${page.slug}: ${path}`);
  }
});

test('ad pages open on their own headline, canonical and second wizard step', () => {
  for (const { variant, html: page } of pages.filter(item => item.variant)) {
    assert.ok(page.includes(`<span class="h1-key">${variant.h1}</span>`));
    assert.ok(page.includes(`<link rel="canonical" href="${variant.canonical}">`));
    assert.ok(page.includes(`<body data-service="${variant.service}">`));
    assert.ok(page.includes('data-at="size"'));
    assert.ok(page.includes('<div class="wiz-step" data-step="service" hidden>'));
    assert.ok(page.includes(`<div class="wiz-sizes" data-for="${variant.service}">`));
    assert.equal((page.match(/<h1/g) || []).length, 1);
  }
});

test('stock hero photos are labelled and the own-work hero is not', () => {
  const heroOf = page => page.slice(page.indexOf('<div class="hero-photo">'), page.indexOf('<div class="wrap hero-inner">'));
  for (const { slug, html: page } of pages) {
    const hero = heroOf(page);
    if (hero.includes('/assets/stock/')) assert.ok(hero.includes('Temsili görsel'), slug);
    else assert.ok(!hero.includes('Temsili'), slug);
  }
});

test('the work gallery only shows the business’s own photographs', () => {
  const gallery = html.slice(html.indexOf('<div class="work-track">'), html.indexOf('id="hizmetler"'));
  assert.ok(gallery.includes('/assets/work/'));
  assert.ok(!gallery.includes('/assets/stock/'));
});

test('all 21 reviews are published verbatim and the count matches', () => {
  assert.equal(reviews.length, 21);
  assert.equal((html.match(/<article class="review">/g) || []).length, reviews.length);
  const page = decode(html);
  for (const review of reviews) {
    assert.ok(page.includes(review.text), review.name);
    assert.ok(page.includes(review.name), review.name);
    assert.ok(page.includes(review.service), review.name);
    assert.ok(page.includes(`datetime="${review.date}"`), review.name);
  }
  assert.ok(html.includes(`${reviews.length} müşteri yorumu`));
  assert.ok(html.includes(`${reviews.length - 6} yorum daha`));
});

test('customer quotes used as selling points are real words from that customer', () => {
  const quotes = [...html.matchAll(/<blockquote>“(?:… )?([^”]+)”<\/blockquote><cite>([^<]+)<\/cite>/g), ...html.matchAll(/<blockquote class="process-quote">“([^”]+)”<cite>([^<]+)<\/cite>/g)];
  assert.ok(quotes.length >= 5);
  for (const [, quote, name] of quotes) {
    const source = reviews.find(review => review.name === name);
    assert.ok(source, name);
    assert.ok(source.text.includes(quote), `${name}: ${quote}`);
  }
});

test('no aggregate rating or invented guarantee, discount or customer count', () => {
  assert.ok(!html.includes('aggregateRating'));
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const pattern of [/\d\s*yıl (?:işçilik |yazılı )?garanti/i, /%\s?\d/, /\d+\s?\+?\s?(?:proje|müşteri memnun)/i, /kampanya|indirim/i]) {
    assert.ok(!pattern.test(visible), String(pattern));
  }
});
