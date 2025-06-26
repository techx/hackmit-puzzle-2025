package cgroup

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/redpwn/jail/internal/proto/nsjail"
	"golang.org/x/sys/unix"
)

type Cgroup interface {
	Mount() error
	SetConfig(*nsjail.NsJailConfig) error
}

const (
	rootPath   = "/jail/cgroup"
	mountFlags = uintptr(unix.MS_NOSUID | unix.MS_NODEV | unix.MS_NOEXEC | unix.MS_RELATIME)
)

func checkExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, os.ErrNotExist) {
		return false, nil
	}
	return false, err
}

func Unshare() error {
	// we may already be in a cgroup namespace, but unsharing again is ok
	if err := unix.Unshare(unix.CLONE_NEWCGROUP); err != nil {
		return fmt.Errorf("unshare cgroup: %w", err)
	}
	return nil
}

func ReadCgroup() (Cgroup, error) {
	v1 := &cgroup1{}
	f, err := os.Open("/proc/self/cgroup")
	if err != nil {
		return nil, fmt.Errorf("read cgroup info: %w", err)
	}
	defer f.Close()
	s := bufio.NewScanner(f)
	for s.Scan() {
		parts := strings.SplitN(s.Text(), ":", 3)
		// in some environments we can't depend on the /sys/fs/cgroup mount, so we
		// use the /proc/self/cgroup file to determine the cgroup version and the
		// parents
		entry := &cgroup1Entry{
			controllers: parts[1],
		}
		switch parts[1] {
		case "pids":
			v1.pids = entry
		case "memory":
			v1.mem = entry
		case "cpu", "cpu,cpuacct":
			v1.cpu = entry
		}
	}
	if v1.pids == nil && v1.mem == nil && v1.cpu == nil {
		return &cgroup2{}, nil
	}
	return v1, nil
}
