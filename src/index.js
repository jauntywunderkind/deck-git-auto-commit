import React from 'react';
import ReactDOM from 'react-dom';

import {
	Appear,
	Box,
	CodePane,
	CodeSpan,
	Deck,
	FlexBox,
	FullScreen,
	Grid,
	Heading,
	Image,
	ListItem,
	Markdown,
	Notes,
	OrderedList,
	Progress,
	Slide,
	SpectacleLogo,
	Stepper,
	Text,
	UnorderedList,
	indentNormalizer
} from 'spectacle';

// SPECTACLE_CLI_THEME_START
const theme = {
	fonts: {
		header: '"Open Sans Condensed", Helvetica, Arial, sans-serif',
		text: '"Open Sans Condensed", Helvetica, Arial, sans-serif'
	},
	space: [6, 9, 12]
};
// SPECTACLE_CLI_THEME_END

// SPECTACLE_CLI_TEMPLATE_START
const template = () => (
	<FlexBox
		justifyContent="space-between"
		position="absolute"
		bottom={0}
		width={1}
	>
		<Box padding="0 0.5em">
			<FullScreen />
		</Box>
		<Box padding="0.5em">
			<Progress />
		</Box>
	</FlexBox>
);
// SPECTACLE_CLI_TEMPLATE_END

const formidableLogo =
	'https://avatars2.githubusercontent.com/u/5078602?s=280&v=4';

const cppCodeBlock = indentNormalizer(`
#include <iostream>
#include <cstdlib>
#include <sstream>
#include <pthread.h>

struct thread_data_t
{
	 int	thread_id;
	 std::string message;
};

void *print_thread_message(void *thread_arg)
{
	 struct thread_data_t *thread_data;
	 thread_data = (struct thread_data_t *) thread_arg;

	 cout << "Thread ID: " << thread_data->thread_id;
	 cout << "Message: " << thread_data->message << endl;

	 pthread_exit(NULL);
}

int main()
{
	pthread_t threads[NUM_THREADS];
	struct thread_data_t thread_data[NUM_THREADS];

	for (int i = 0; i < NUM_THREADS; i++)
	{
		auto curried_add = [](int x) -> function<int(int)> { return [=](int y) { return x + y; }; };
		auto answer = curried_add(i)(5);

		std::stringstream message;
		message << "The math result is " << answer << "!";
		thread_data.thread_id = i;
		thread_data.message = message.str();
		int err = pthread_create(&threads, NULL, print_thread_message, (void *)&thread_data[i]);

		if (err)
		{
			exit(-1)
		}
	}

	return 0;
}`);

function Index(n = 0, id) {
	function color(i) {
		return n <= i ? "primary" : colors.dim
	}
	return <Slide id={id}>
			<Heading><CodeSpan>git-auto-commit:</CodeSpan> the talk</Heading>
			<OrderedList>
				<ListItem fontWeight="bolder" color={color(0)}>Background</ListItem>
				<ListItem fontWeight="bolder" color={color(1)}><CodeSpan>git-auto-commit</CodeSpan></ListItem>
				<ListItem fontWeight="bolder" color={color(2)}>How: <CodeSpan>watchman</CodeSpan></ListItem>
				<ListItem fontWeight="bolder" color={color(3)}>callbacks vs asynchronous iteration</ListItem>
				<ListItem fontWeight="bolder" color={color(3)}>How: <CodeSpan>watchman-client</CodeSpan></ListItem>
				<ListItem fontWeight="bolder" color={color(4)}>Doing more: pushing changes</ListItem>
				<ListItem fontWeight="bolder" color={color(4)}>Bonus: <CodeSpan>gitdoc</CodeSpan></ListItem>
				<ListItem fontWeight="bolder" color={color(4)}>Future Improvements</ListItem>
			</OrderedList>
			<Notes>{id}</Notes>
		</Slide>
}

function BigText(text, id, notes) {
	return <Slide backgroundColor="tertiary" id={id}>
			<FlexBox height="100%" flexDirection="column">
				<Heading fontSize="200px">{text}</Heading>
			</FlexBox>
			<Notes>{notes}</Notes>
		</Slide>
}

const colors= {
	dim: "#ccc",
	spice: "#ccf"
}

// womp womp spread operators not working with this babel
const style= {
	index: {
		fontWeight: "bolder"
	}
}

const Presentation = () => (
	<Deck theme={theme} template={template} transitionEffect="fade">
		<Slide>
			<FlexBox height="100%" flexDirection="column">
				<Heading margin="0px" fontSize="92px">
					git-auto-commit
				</Heading>
				<Heading margin="0px" fontSize="h2">
					watching for changes & saving them
				</Heading>
				<Image src="/public/git-logo.png" />
				<Heading margin="0px" color="primary" fontSize="h3">
					with a little help from Watchman
				</Heading>
			</FlexBox>
			<Notes>
				<p>
					Welcome! Welcome to this talk on git-auto-commit, a fun utility I....

					Notes are shown in presenter mode. Open up
					localhost:9418/?presenterMode=true to see them.
				</p>
			</Notes>
		</Slide>
		{Index(0, "background")}
		{BigText("Background", "background", "motivation, concern (keeping track/copy paste/check in), make better")}
		<Slide>
			<UnorderedList>
				<Appear elementNum={0}>
					<Heading fontSize="h3">Motivation: note taking, journalling</Heading>
					<Text>My go-to means to put down information is directories of text & markdown files.</Text>
				</Appear>
				<Appear elementNum={1}>
					<Heading fontSize="h3">Concern: keeping tracking of my writing over time</Heading>
					<Text>How do I iterate on my writing & thoughts?</Text>
				</Appear>
				<Appear elementNum={2}>
					<Text>Historically, I would often copy-paste to duplicate chunks of writing before starting to edit them, so as to not loose the original.</Text>
				</Appear>
				<Appear elementNum={3}>
					<Text>I'd check work into git, but not frequently.</Text>
				</Appear>
				<Appear elementNum={4}>
					<Heading fontSize="h3">How could I make this better?</Heading>
				</Appear>
			</UnorderedList>
		</Slide>
		{BigText("Automate It", "automate", "and that set me on the path to build")}
		<Slide>
			<FlexBox width="100%" flexDirection="row">
				<Image src="/public/go-away.webp" height="600" width="450"/>
			</FlexBox>
		</Slide>
		<Slide>
			<Heading fontSize="h2">
				Write it!
			</Heading>
			<Heading><CodeSpan>git-auto-commit</Heading>
		</Slide>
		<Slide
			backgroundColor="tertiary"
			backgroundImage="url(https://github.com/FormidableLabs/dogs/blob/master/beau.jpg?raw=true)"
			backgroundOpacity={0.5}
		>
			<Heading>Custom Backgrounds</Heading>
			<UnorderedList>
				<ListItem>
					<CodeSpan>backgroundColor</CodeSpan>
				</ListItem>
				<ListItem>
					<CodeSpan>backgroundImage</CodeSpan>
				</ListItem>
				<ListItem>
					<CodeSpan>backgroundOpacity</CodeSpan>
				</ListItem>
				<ListItem>
					<CodeSpan>backgroundSize</CodeSpan>
				</ListItem>
				<ListItem>
					<CodeSpan>backgroundPosition</CodeSpan>
				</ListItem>
				<ListItem>
					<CodeSpan>backgroundRepeat</CodeSpan>
				</ListItem>
			</UnorderedList>
		</Slide>
		<Slide transitionEffect="slide">
			<Heading>Code Blocks</Heading>
			<Stepper
				defaultValue={[]}
				values={[
					[1, 1],
					[23, 25],
					[40, 42]
				]}
			>
				{(value, step) => (
					<Box position="relative">
						<CodePane
							highlightStart={value[0]}
							highlightEnd={value[1]}
							fontSize={18}
							language="cpp"
							autoFillHeight
						>
							{cppCodeBlock}
						</CodePane>

						<Box
							position="absolute"
							bottom="0rem"
							left="0rem"
							right="0rem"
							bg="black"
						>
							{/* This notes container won't appear for step 0 */}

							{step === 1 && (
								<Text fontSize="1.5rem" margin="0rem">
									This is a note!
								</Text>
							)}

							{step === 2 && (
								<Text fontSize="1.5rem" margin="0rem">
									You can use the stepper state to render whatever you like as
									you step through the code.
								</Text>
							)}
						</Box>
					</Box>
				)}
			</Stepper>
			<Text>
				Code Blocks now auto size and scroll when there is an overflow of
				content! They also auto-wrap longer lines.
			</Text>
		</Slide>
		<Slide>
			<Heading>Animated Elements</Heading>
			<OrderedList>
				<Appear elementNum={0}>
					<ListItem>Elements can animate in!</ListItem>
				</Appear>
				<Appear elementNum={2}>
					<ListItem>
						Just identify the order with the prop{' '}
						<CodeSpan>elementNum</CodeSpan>!
					</ListItem>
				</Appear>
				<Appear elementNum={1}>
					<ListItem>Out of order</ListItem>
				</Appear>
			</OrderedList>
		</Slide>
		<Slide>
			<FlexBox>
				<Text>These</Text>
				<Text>Text</Text>
				<Text color="secondary">Items</Text>
				<Text fontWeight="bold">Flex</Text>
			</FlexBox>
			<Grid gridTemplateColumns="1fr 2fr" gridColumnGap={15}>
				<Box backgroundColor="primary">
					<Text color="secondary">Single-size Grid Item</Text>
				</Box>
				<Box backgroundColor="secondary">
					<Text>Double-size Grid Item</Text>
				</Box>
			</Grid>
			<Grid
				gridTemplateColumns="1fr 1fr 1fr"
				gridTemplateRows="1fr 1fr 1fr"
				alignItems="center"
				justifyContent="center"
				gridRowGap={1}
			>
				{Array(9)
					.fill('')
					.map((_, index) => (
						<FlexBox paddingTop={0} key={`formidable-logo-${index}`} flex={1}>
							<Image src={formidableLogo} width={100} />
						</FlexBox>
					))}
			</Grid>
		</Slide>
		<Slide>
			<Markdown>
				{`
					# Layout Tables in Markdown

					| Browser				 | Supported | Versions |
					|-----------------|-----------|----------|
					| Chrome					| Yes			 | Last 2	 |
					| Firefox				 | Yes			 | Last 2	 |
					| Opera					 | Yes			 | Last 2	 |
					| Edge (EdgeHTML) | No				|					|
					| IE 11					 | No				|					|
				`}
			</Markdown>
		</Slide>
		<Markdown containsSlides>
			{`
				### Even write multiple slides in Markdown
				> Wonderfully formatted quotes

				1. Even create
				2. Lists in Markdown


				- Or Unordered Lists
				- Too!!
				Notes: These are notes
				---
				### This slide was also generated in Markdown!

				\`\`\`jsx
				const evenCooler = "is that you can do code in Markdown";
				// You can even specify the syntax type!
				\`\`\`

				### A slide can have multiple code blocks too.

				\`\`\`c
				char[] someString = "Popular languages like C too!";
				\`\`\`

				Notes: These are more notes
			`}
		</Markdown>
	</Deck>
);

ReactDOM.render(<Presentation />, document.getElementById('root'));
