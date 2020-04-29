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
			<Heading><CodeSpan>git-auto-commit</CodeSpan></Heading>
			<UnorderedList>
				<ListItem>Watch the file system</ListItem>
				<ListItem>Make commits</ListItem>
			</UnorderedList>
		</Slide>
		{BigText("How?", "how", "what would i use to put this together, how would i make this go?")}
		<Slide>
			<Markdown>
				{`
				1. `node.js` - generally my style
				1. `isomoprhic-git` - a native impl of git for js
				1. `fs.Watch` - the general tool for watching files
				  1. but difficult to do recursively
				  1. still requires filtering
				  1. ...some other technical concerns
				  1. which brings me to...
				`}
			</Markdown>
		</Slide>
		<Slide>
			<Image src="/public/watchman.webp" />
		</Slide>
	</Deck>
);

ReactDOM.render(<Presentation />, document.getElementById('root'));
