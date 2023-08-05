<script setup>
const articles = [
    {
        link: '/articles/article-1',
        published: '2023-08-05',
        title: 'Article 1',
        blurb: 'Elixir npm build tool val module cache. Animation hipchat variable site reliability engineer rebase duck typing distributed systems callback hell consensus module. CSS-in-JS domain blockchain merge sort var LGTM dynamic types subclass callback. Compile font budget freelancer websockets contribution RSS feed domain specific language.',
    },
    {
        link: '/articles/article-2',
        published: '2023-08-05',
        title: 'Article 2',
        blurb: 'Hacker News OTP CSV pivot webpack pattern a place for everything parameter responsive DSL. Firefox environment Ruby greenfield ecommerce platform frontend. Engineer compilation fullstack Kubernetes REST continuous integration remote procedure call.',
    },
    {
        link: '/articles/article-3',
        published: '2023-08-05',
        title: 'Article 3',
        blurb: 'Inheritance container Hacker News lazy eval remote procedure call stack trace compile DAG IRC Netscape. MacBook compiler test-driven RSS feed controller serverless coding. Npm build tool engineer domain gulp mutation observer circle back FP. Gate-keeping ecommerce platform OOP heap sort views yarn uglify.',
    },
    {
        link: '/articles/article-4',
        published: '2023-08-05',
        title: 'Article 4',
        blurb: 'DevTools AWS reflog streams i tree shaking API. A place for everything compile Internet Explorer void scrum master Twitter dynamic types looks good to me markup dog-piling. Yarn legacy inheritance JavaScript Linux queue shareware static typing documentation driven observer pattern. Byzantine fault tolerance hardcoded state stack trace antipattern streams.',
    },
]

function dateToString(date) {
    let newDate = new Date(date)
    let options = {
        month: "long",
        day: "numeric",
        year: "numeric",
    }
    return Intl.DateTimeFormat('en-AU', options).format(newDate)
}
</script>

<template>
    <div class="flex flex-col gap-16">

        <article v-for="article in articles" class="relative flex flex-col items-start group">
            <h2 class="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                <div
                    class="absolute z-0 transition scale-95 opacity-0 -inset-x-4 -inset-y-6 bg-zinc-50 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 sm:-inset-x-6 sm:rounded-2xl">
                </div>
                <a :href="article.link"><span class="absolute z-20 -inset-x-4 -inset-y-6 sm:-inset-x-6 sm:rounded-2xl">
                    </span>
                    <span class="relative z-10">{{ article.title }}</span>
                </a>
            </h2>
            <time class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5"
                :datetime="article.published">
                <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                    <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500">
                    </span>
                </span>
                {{ dateToString(article.published) }}
            </time>
            <p class="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">{{ article.blurb }}</p>
            <div aria-hidden="true" class="relative z-10 flex items-center mt-4 text-sm font-medium text-emerald-500">
                Read article<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="w-4 h-4 ml-1 stroke-current">
                    <path d="M6.75 5.75 9.25 8l-2.5 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">

                    </path>
                </svg>
            </div>
        </article>

    </div>
</template>
