"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Какой рисунок можно вышить?",
    answer:
      "Практически любой детский рисунок: карандашом, фломастерами, красками или ручкой. Главное — чтобы его можно было хорошо сфотографировать или отсканировать.",
  },
  {
    question: "Вы перерисовываете рисунок ребёнка?",
    answer:
      "Мы не стараемся сделать его «правильнее». Сохраняем характер линий, пропорции и детали, но технически адаптируем рисунок для вышивальной машины.",
  },
  {
    question: "Я увижу макет до вышивки?",
    answer:
      "Да. Сначала мы подготовим рисунок в специальной программе и отправим вам макет на согласование. Только после вашего одобрения запускаем вышивку.",
  },
  {
    question: "Что делать, если я не знаю, сколько цветов в рисунке?",
    answer:
      "Ничего страшного. В калькуляторе можно выбрать «Не знаю». Когда получим рисунок, сами определим количество цветов и подтвердим окончательную стоимость.",
  },
  {
    question: "Можно вышить несколько рисунков на одной вещи?",
    answer:
      "Да. На свитшотах, худи и зип-худи можно разместить несколько рисунков в разных местах. Каждый рисунок в таком варианте — размером до A6.",
  },
  {
    question: "Сколько времени занимает изготовление?",
    answer: "Обычно изготовление занимает от 3–4 рабочих дней после согласования макета.",
  },
  {
    question: "Можно заказать взрослую вещь с рисунком ребёнка?",
    answer:
      "Конечно. У нас есть детские и взрослые модели. Можно сделать вещь для самого ребёнка или подарок маме, папе, бабушке, дедушке и другим близким.",
  },
  {
    question: "Как ухаживать за вещью с вышивкой?",
    answer:
      "Стирайте при температуре до 30 °C, вывернув изделие наизнанку. Рекомендуем использовать жидкое средство для стирки.",
  },
  {
    question: "Как происходит доставка?",
    answer:
      "По России отправляем СДЭК. По Москве можно выбрать СДЭК или Яндекс Доставку. Также возможен самовывоз по адресу: Москва, ул. Корнейчука, д. 54А. Стоимость доставки оплачивает покупатель отдельно.",
  },
  {
    question: "Почему стоимость в калькуляторе предварительная?",
    answer:
      "Окончательную стоимость мы можем подтвердить после того, как увидим ваш рисунок. До оплаты и начала работы согласуем с вами макет и итоговую цену — никаких неожиданных доплат после запуска вышивки.",
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-y border-line bg-surface px-3 py-16 min-[360px]:px-4 sm:px-6 sm:py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Вопросы и ответы</p>
          <h2 className="mt-3 text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            Частые вопросы
          </h2>
        </header>

        <div className="border-t border-line">
          {faqItems.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index + 1}`;
            const answerId = `faq-answer-${index + 1}`;

            return (
              <div key={question} className="border-b border-line">
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left text-base font-semibold leading-snug hover:text-accent focus-visible:rounded-small focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary sm:min-h-20 sm:py-5 sm:text-lg"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{question}</span>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xl font-normal leading-none text-accent"
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  hidden={!isOpen}
                  className="pb-5 pr-12 sm:pb-7 sm:pr-16"
                >
                  <p className="max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">{answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
