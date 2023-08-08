<script setup>
import ImageTextBlock from '@/components/common/ImageTextBlock.vue'
import TextBlock from '@/components/common/TextBlock.vue'
import heroImg from '/src/assets/img/shaun-pilot.jpeg'
</script>

<template>
    <div class="about">
        <ImageTextBlock title="Hello there!" :img="heroImg" height="w-44" width="w-44">
            <p class="mt-6 text-base text-default">My name is Shaun and I am software developer living
                in Sydney, Australia. I have a much beloved wife, two amazing children and an incredibly spoiled and
                treasured dog. I occasionally build things in the real world such as custom furniture too. I love to BBQ and
                catch up with friends and family whenever I have time too, preferably with a slow cooking charcoal offset
                bbq in the background.
            </p>
        </ImageTextBlock>
        <TextBlock>
            <p class="mt-6 text-base text-default">
                I have been working in the software industry for a decade now, and have been fortunate enough to work with some amazing people and companies. I have worked in a variety ofdevelopment based roles, from design, to development,
                to architecture and system design. I have had the blessing of working with some amazinglky talented professionals from designers, to copywriters, project managers and other developers. They have all taught me something, and for that I am grateful.
            </p>

            <p class="mt-6 text-base text-default">
                I wasn't always in the industry and I bring from my previous careers a strong focus on customer experience. It has also blessed me with perspective, as I have often been on the other end odf software someone designed, and it helps me empathise with users for a better understanding of UX.
            </p>

            <p class="mt-6 text-base text-default">
                Lastly, I am an artist at heart and always looking for solutions that solve the needs and are also beuatiful. I try to bring this to my work, whether it is making elegant code, simple API's that are easy to consume or interfaces that simplify complex tasks. Small details sometimes can yield huge results.
            </p>

        </TextBlock>
    </div>
</template>
